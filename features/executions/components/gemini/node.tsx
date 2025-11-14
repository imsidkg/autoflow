import { memo, useState } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchHttpRequestRealtimeToken } from "./action";
import { AVAILABLE_MODELS, GeminiDialog, GeminiFormValues } from "./dialog";

export type AvailableModel = typeof AVAILABLE_MODELS[number];

export type GeminiNodeData = {
  model?:  AvailableModel;
  systemPrompt?: string;
  userPrompt?: string;
};

export type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "gemini-execution",
    topic: "status",
    refreshToken: fetchHttpRequestRealtimeToken,
  });
  const nodeData = props.data ?? {};
  const handleOpenSettings = () => setDialogOpen(true);
  const description =
    nodeData.userPrompt
      ? `${nodeData.model ?? AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0,50)}...`
      : "Not configured";

  const handleSubmit = (values: GeminiFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }

        return node;
      })
    );
  };

  return (
    <div>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/gemini.svg"
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
    </div>
  );
});

GeminiNode.displayName = "GeminiNode";
