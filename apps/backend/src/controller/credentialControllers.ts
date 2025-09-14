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
    return res.status(404).json({
      message: "Failed to find credential or you do not have access.",
    });
  }
};

export const updateCredential = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Credential ID must be provided in the params." });
  }

  const { type, name, data } = req.body;

  if (!type && !name && !data) {
    return res.status(400).json({ message: "No update data provided." });
  }

  try {
    const dataSource = await getAppDataSource();
    const credentialsRepository = dataSource.getRepository(Credential);

    let credentialToUpdate = await credentialsRepository.findOneBy({
      id,
      user: { id: ownerId },
    });

    if (!credentialToUpdate) {
      return res
        .status(404)
        .json({ message: "Credential not found or you do not have access." });
    }

    if (type !== undefined) {
      credentialToUpdate.type = type;
    }
    if (name !== undefined) {
      credentialToUpdate.name = name;
    }
    if (data !== undefined) {
      credentialToUpdate.data = data;
    }

    await credentialsRepository.save(credentialToUpdate);

    const { data: sensitiveData, ...safeCredential } = credentialToUpdate;
    return res.status(200).json({
      message: "Credential updated successfully",
      credential: safeCredential,
    });
  } catch (error) {
    console.error("Error updating credential:", error);
    return res.status(500).json({
      message: "Failed to update credential due to a server error.",
    });
  }
};

export const deleteCredential = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Credential ID must be provided in the params.",
    });
  }

  try {
    const dataSource = await getAppDataSource();
    const credentialsRepository = dataSource.getRepository(Credential);

    const credential = await credentialsRepository.findOneBy({
      id,
      user: { id: ownerId },
    });

    if (!credential) {
      return res.status(404).json({
        message: "Credential not found or you do not have access.",
      });
    }

    await credentialsRepository.remove(credential);

    return res.status(200).json({
      message: "Credential deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting credential:", error);
    return res.status(500).json({
      message: "Failed to delete credential due to a server error.",
    });
  }
};
