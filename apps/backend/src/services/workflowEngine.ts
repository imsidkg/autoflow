import { Execution, getAppDataSource } from "@repo/db";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const processWorkflow = async (executionId: string) => {
  const dataSource = await getAppDataSource();
  const executionRepository = dataSource.getRepository(Execution);
  const execution = await executionRepository.findOneBy({ id: executionId });

  if (!execution) {
    console.error(`[Worker] Execution not found: ${executionId}`);
    return;
  }

  // Set execution status to running
  execution.status = 'running';
  await executionRepository.save(execution);

  const nodes = execution.workflowData.nodes;
  const connections = execution.workflowData.connections;

  let startingNodes;
  const customStartNodes = execution.mode?.startNodes;

  if (customStartNodes && customStartNodes.length > 0) {
    startingNodes = nodes.filter((node) =>
      customStartNodes.includes(node.id)
    );
  } else {
    startingNodes = nodes.filter((node) => node.type === "trigger");
  }

  if ((!customStartNodes || customStartNodes.length === 0) && startingNodes.length !== 1) {
    console.error(
      `[Worker] Workflow ${execution.workflowId} has no unique trigger.`
    );
    execution.status = "error";
    await executionRepository.save(execution);
    return;
  }

  const queueKey = `queue:${executionId}`;
  await redis.del(queueKey); // Clear any old queue data
  await redis.rpush(
    queueKey,
    ...startingNodes.map((node) => JSON.stringify(node))
  );

  console.log(`[Worker] Processing workflow for execution: ${executionId}`);

  let nodeJSON;
  while ((nodeJSON = await redis.lpop(queueKey))) {
    const node = JSON.parse(nodeJSON);
    console.log(
      `[Worker] Executing node: ${node.data?.label} (ID: ${node.id})`
    );

    // TODO: Implement your node execution logic here based on node.type
    // For example:
    // switch (node.type) {
    //   case 'action':
    //     // ... handle action
    //     break;
    //   case 'delay':
    //     // ... handle delay
    //     break;
    // }

    // Find next nodes and add them to the queue
    const nextNodeIds: string[] = [];
    for (const conn of connections) {
      // conn is an object like { "source-node-id": { ... } }
      for (const sourceNodeId in conn) {
        if (sourceNodeId === node.id) {
          const sourceNodeOutputs = conn[sourceNodeId];
          if (sourceNodeOutputs) {
            // Iterate over the output handles (e.g., 'main', 'output_1')
            for (const outputHandleKey in sourceNodeOutputs) {
              const targets = sourceNodeOutputs[outputHandleKey];
              if (targets) {
                // Add the target node IDs to our list
                for (const target of targets) {
                  nextNodeIds.push(target.node);
                }
              }
            }
          }
        }
      }
    }

    if (nextNodeIds.length > 0) {
      // Remove duplicates before finding the nodes
      const uniqueNextNodeIds = [...new Set(nextNodeIds)];
      const nextNodes = nodes.filter(n => uniqueNextNodeIds.includes(n.id));
      
      if (nextNodes.length > 0) {
        await redis.rpush(
          queueKey,
          ...nextNodes.map((n) => JSON.stringify(n))
        );
      }
    }
  }

  // Set execution status to success
  execution.status = 'success';
  execution.finishedAt = new Date();
  await executionRepository.save(execution);

  console.log(`[Worker] Execution ${executionId} finished successfully.`);
};
