import { getAppDataSource, Workflow } from "@repo/db";
import type { Request, Response } from "express";

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
    newWorkflow.connections = connections || {};
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
    workflowToUpdate.nodes =
      nodes !== undefined ? nodes : workflowToUpdate.nodes;
    workflowToUpdate.connections =
      connections !== undefined ? connections : workflowToUpdate.connections;
    workflowToUpdate.active =
      active !== undefined ? active : workflowToUpdate.active;
    workflowToUpdate.settings =
      settings !== undefined ? settings : workflowToUpdate.settings;
    workflowToUpdate.staticData =
      staticData !== undefined ? staticData : workflowToUpdate.staticData;
    workflowToUpdate.description =
      description !== undefined ? description : workflowToUpdate.description;

    await workflowRepository.save(workflowToUpdate);

    return res.status(200).json(workflowToUpdate);
  } catch (error) {
    console.error("Error updating workflow:", error);
    return res.status(500).json({ message: "Failed to update workflow." });
  }
};

export const getWorkflowsByUserId = async (req: AuthRequest, res: Response) => {
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
