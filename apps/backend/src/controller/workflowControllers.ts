import { getAppDataSource, Workflow } from "@repo/db";
import type { Request, Response } from "express";

export const createWorkflow = async (req: Request, res: Response) => {
  const {
    name,
    nodes,
    connections,
    active,
    settings,
    staticData,
    description,
    ownerId,
  } = req.body;

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
