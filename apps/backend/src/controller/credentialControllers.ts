import type { Request, Response } from "express";
import { getAppDataSource, Credential } from "@repo/db";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const createCredential = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { type, name, data } = req.body;
  if (!type || !name || !data) {
    return res.status(400).json({ message: "Insufficient data was provided" });
  }

  try {
    const dataSource = await getAppDataSource();
    const credentialsRepository = dataSource.getRepository(Credential);

    const newCredential = new Credential();
    newCredential.data = data;
    newCredential.name = name;
    newCredential.type = type;
    newCredential.user = ownerId as any;

    await credentialsRepository.save(newCredential);

    const { data: sensitiveData, ...safeCredential } = newCredential;
    return res.status(201).json({
      message: "Credential saved successfully",
      credential: safeCredential,
    });
  } catch (error) {
    console.error("Error creating credential:", error);
    return res.status(500).json({ message: "Failed to create credential." });
  }
};
