import { NodeType } from "@/lib/generated/prisma";
import { InitialNode } from "@/components/initial-nodes";
import { NodeTypes } from "@xyflow/react";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST] : HttpRequestNode
  // [NodeType.MANUAL_TRIGGER] : 
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
