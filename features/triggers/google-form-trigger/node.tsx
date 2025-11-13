import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerClickIcon } from "lucide-react"; 
import { BaseTriggerNode } from "../components/base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = "initial";

  const handleOpenSettings = () => setDialogOpen(true);
  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon='/logos/googleform.svg'
        name="Google Form"
        description="When the form is submitted"
        onSettings={handleOpenSettings}
        status={nodeStatus}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

