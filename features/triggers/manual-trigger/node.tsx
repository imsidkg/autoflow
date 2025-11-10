import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerClickIcon } from "lucide-react"; // or MousePointerIcon if you're using that
import { BaseTriggerNode } from "../components/base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = "loading";

  const handleOpenSettings = () => setDialogOpen(true);
  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerClickIcon}
        name="When clicking 'Execute workflow'"
        onSettings={handleOpenSettings}
        status={nodeStatus}
        onDoubleClick={() => {
          // Optional: same or different behavior
        }}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
