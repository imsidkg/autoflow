import { getAppDataSource, Workflow, Execution } from "@repo/db";
import type { Request, Response } from "express";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const QUEUE_NAME = "workflow-execution-queue";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const createWorkflow = async (req: AuthRequest, res: Response) => {
  const {
    name,
    nodes,
    connections,
    active,
    settings,
    staticData,
    description,
  } = req.body;
  const ownerId = req.user?.id;
  if (!name || !ownerId) {
    return res
      .status(400)
      .json({ message: "Workflow name and ownerId are required." });
  }

  try {
    const dataSource = await getAppDataSource();
    const workflowRepository = dataSource.getRepository(Workflow);

    const newWorkflow = new Workflow();
    newWorkflow.name = name;
    newWorkflow.nodes = nodes || [];
    newWorkflow.connections = connections || [];
    newWorkflow.active = active !== undefined ? active : false;
    newWorkflow.settings = settings || {};
    newWorkflow.staticData = staticData || {};
    newWorkflow.description = description || null;
    newWorkflow.ownerId = ownerId;

    await workflowRepository.save(newWorkflow);

    return res.status(201).json(newWorkflow);
  } catch (error) {
    console.error("Error creating workflow:", error);
    return res.status(500).json({ message: "Failed to create workflow." });
  }
};

export const getWorkflowById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const dataSource = await getAppDataSource();
    const workflowRepository = dataSource.getRepository(Workflow);

    const workflow = await workflowRepository.findOneBy({ id, ownerId });

    if (!workflow) {
      return res
        .status(404)
        .json({ message: "Workflow not found or you do not have access." });
    }

    return res.status(200).json(workflow);
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return res.status(500).json({ message: "Failed to fetch workflow." });
  }
};

export const updateWorkflow = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    name,
    nodes,
    connections,
    active,
    settings,
    staticData,
    description,
  } = req.body;
  const ownerId = req.user?.id;
  if (!ownerId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const dataSource = await getAppDataSource();
    const workflowRepository = dataSource.getRepository(Workflow);

    let workflowToUpdate = await workflowRepository.findOneBy({ id, ownerId });

    if (!workflowToUpdate) {
      return res
        .status(404)
        .json({ message: "Workflow not found or you do not have access." });
    }

    workflowToUpdate.name = name !== undefined ? name : workflowToUpdate.name;

    if (nodes !== undefined) {
      workflowToUpdate.nodes = JSON.parse(JSON.stringify(nodes));
    }
    if (connections !== undefined) {
      workflowToUpdate.connections = JSON.parse(JSON.stringify(connections));
    }

    workflowToUpdate.active =
      active !== undefined ? active : workflowToUpdate.active;
    workflowToUpdate.settings =
      settings !== undefined ? settings : workflowToUpdate.settings;
    workflowToUpdate.staticData =
      staticData !== undefined ? staticData : workflowToUpdate.staticData;
    workflowToUpdate.description =
      description !== undefined ? description : workflowToUpdate.description;

    await workflowRepository.save(workflowToUpdate);
    console.log(`[Backend] Workflow ID: ${id} saved successfully.`);
    return res.status(200).json(workflowToUpdate);
  } catch (error) {
    console.error("Error updating workflow:", error);
    return res.status(500).json({ message: "Failed to update workflow." });
  }
};

export const getWorkflowsByUserId = async (
  req: AuthRequest,
  res: Response
) => {
  const ownerId = req.user?.id;
  if (!ownerId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const dataSource = await getAppDataSource();
    const workflowRepository = dataSource.getRepository(Workflow);
    const workflows = await workflowRepository.findBy({ ownerId });

    return res.status(200).json(workflows);
  } catch (error) {
    console.error("Error fetching workflows by user ID:", error);
    return res.status(500).json({ message: "Failed to fetch workflows." });
  }
};

export const executeWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(401).json({ messsage: "Authentication Required" });
    }

    const dataSource = await getAppDataSource();
    const workflowRepository = dataSource.getRepository(Workflow);
    const workflow = await workflowRepository.findOneBy({ id, ownerId });

    if (!workflow)
      return res
        .status(404)
        .json({ message: "Workflow not found or you do not have access." });

    const executionRepository = dataSource.getRepository(Execution);
    const newExecution = new Execution();
    newExecution.workflowId = workflow.id;
    newExecution.userId = ownerId;
    newExecution.status = "new";
    newExecution.workflowData = {
      id: workflow.id,
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings,
      staticData: workflow.staticData,
    };

    newExecution.data = {
      startData: {},
      resultData: {
        runData: {},
      },
    };
    newExecution.mode = { mode: 'manual' };

    await executionRepository.save(newExecution);

    // Push the execution ID to the Redis queue for the worker to pick up
    await redis.rpush(QUEUE_NAME, newExecution.id);

    return res.status(202).json({
      message: "Workflow execution has been queued.",
      executionId: newExecution.id,
    });
  } catch (error) {
    console.error("Error executing workflow:", error);
    return res.status(500).json({ message: "Failed to execute workflow." });
  }
};

