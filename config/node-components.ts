import { NodeType } from "@/lib/generated/prisma";
import { InitialNode } from "@/components/initial-nodes";
import { NodeTypes } from "@xyflow/react";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/manual-trigger/node";
import { GoogleFormTrigger } from "@/features/triggers/google-form-trigger/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST] : HttpRequestNode,
  [NodeType.MANUAL_TRIGGER] : ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER] : GoogleFormTrigger,
  [NodeType.GEMINI] : GeminiNode
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
