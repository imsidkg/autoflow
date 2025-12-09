import { NodeType } from "@/lib/generated/prisma";
import { NodeExecutor } from "../type";
import { httpRequestExecutor } from "../components/http-request/executor";
import { manualTriggerExecutor } from "@/features/triggers/google-form-trigger/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/manual-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { discordExecutor } from "../components/discord/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { openaiExecutor } from "../components/openai/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.OPENAI]: openaiExecutor,

};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];

  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
