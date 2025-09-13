import { Router } from "express";
import {
  createWorkflow,
  getWorkflowById,
  updateWorkflow,
  getWorkflowsByUserId,
} from "../controller/workflowControllers";

const router = Router();

router.post("/workflow", createWorkflow);
router.get("/:id", getWorkflowById);
router.put("/:id", updateWorkflow);
router.get("/", getWorkflowsByUserId);

export default router;
