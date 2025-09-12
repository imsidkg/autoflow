import { Router } from "express";
import { createWorkflow } from "../controller/workflowControllers";

const router = Router();

router.post("/workflow", createWorkflow);

export default router;
