import { NodeType } from "@/lib/generated/prisma";
import { NodeExecutor } from "../type";
import { httpRequestExecutor } from "../components/http-request/executor";
import { manualTriggerExecutor } from "@/features/triggers/google-form-trigger/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/manual-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.GEMINI] : geminiExecutor

};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];

  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
