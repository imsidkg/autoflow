import { Execution, getAppDataSource } from "@repo/db";
import Redis from "ioredis";

export const processWorkflow = async (executionId: string) => {
  const dataSource = await getAppDataSource();
  const redis = new Redis();

  const executionRepository = dataSource.getRepository(Execution);
  const execution = await executionRepository.findOneBy({ id: executionId });
  let startingNodes;
  if (!execution) {
    return;
  }

  const nodes = execution.workflowData.nodes;
  const connections = execution.workflowData.connections;
  if (execution.mode.startNodes && execution.mode?.startNodes.length > 0) {
    startingNodes = nodes.filter((node) =>
      execution.mode?.startNodes?.includes(node.id)
    );
  } else {
    startingNodes = nodes.filter((node) => node.type === "trigger");
  }

  if (
    (!execution.mode?.startNodes || execution.mode.startNodes.length === 0) &&
    startingNodes.length !== 1
  ) {
    return;
  }

  const queueKey = `queue${executionId}`;
  await redis.del(queueKey);
  await redis.rpush(queueKey, ...startingNodes.map(node => JSON.stringify(node)));
};
