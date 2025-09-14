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

export const getCredentialById = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Credential id must be passed in the params",
    });
  }

  try {
    const dataSource = await getAppDataSource();
    const credentialsRepository = dataSource.getRepository(Credential);
    const credential = await credentialsRepository.findOneBy({
      id,
      user: { id: ownerId },
    });
    if (!credential)
      return res
        .status(500)
        .json({ message: "Credential with specific ID not found" });
    const { data, ...otherDetails } = credential;
    return res.status(200).json({
      otherDetails,
    });
  } catch (error) {
    console.error("Error fetching credential by ID:", error);
    return res
      .status(404)
      .json({
        message: "Failed to find credential or you do not have access.",
      });
  }
};
