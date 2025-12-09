import { memo, useState } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { AVAILABLE_MODELS, AnthropicDialog, AnthropicFormValues } from "./dialog";
import { fetchAnthropicRealtimeToken } from "./action";

export type AvailableModel = (typeof AVAILABLE_MODELS)[number];

export type AnthropicNodeData = {
  model?: AvailableModel;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId: string;
};

export type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "anthropic-execution",
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken,
  });
  const nodeData = props.data ?? {};
  const handleOpenSettings = () => setDialogOpen(true);
  const description = nodeData.userPrompt
    ? `${nodeData.model ?? AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(
        0,
        50
      )}...`
    : "Not configured";

  const handleSubmit = (values: AnthropicFormValues) => {
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
      <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logo/anthropic.svg"
        name="Anthropic"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
    </div>
  );
});

AnthropicNode.displayName = "AnthropicNode";
