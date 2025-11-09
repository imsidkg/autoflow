import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerClickIcon } from "lucide-react"; // or MousePointerIcon if you're using that
import { BaseTriggerNode } from "../components/trigger-execution-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointerClickIcon}
      name="When clicking 'Execute workflow'"
      onSettings={() => {
        // Optional: open settings panel or do nothing
      }}
      onDoubleClick={() => {
        // Optional: same or different behavior
      }}
    />
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
