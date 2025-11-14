import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../components/base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./action";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: "google-form-trigger-execution",
      topic: "status",
      refreshToken: fetchGoogleFormTriggerRealtimeToken,
    });
  

  const handleOpenSettings = () => setDialogOpen(true);
  return (
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon='/logo/googleform.svg'
        name="Google Form"
        description="When the form is submitted"
        onSettings={handleOpenSettings}
        status={nodeStatus}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

