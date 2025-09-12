import "reflect-metadata";
import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import workflowRoutes from "./routes/workflowRoutes"
import { authMiddleware } from "./middleware/authMiddleware";

const app = express()

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/workflows", authMiddleware, workflowRoutes);

export default app;