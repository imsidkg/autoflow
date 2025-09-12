import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Authentication token required." });
  }

  jwt.verify(token, "super_secret", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user as { userId: string; email: string };
    next();
  });
};
