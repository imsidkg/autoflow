import { Router } from "express";
import { createWorkflow, getWorkflowById, updateWorkflow, getWorkflowsByUserId } from "../controller/workflowControllers";

const router = Router();

router.post("/workflow", createWorkflow);
router.get("/workflows/:id", getWorkflowById);
router.put("/workflows/:id", updateWorkflow);
router.get("/workflows", getWorkflowsByUserId);

export default router;
