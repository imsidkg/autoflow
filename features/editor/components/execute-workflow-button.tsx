import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflow";
import { FlaskConicalIcon } from "lucide-react";

const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const executeWorkflow = useExecuteWorkflow();
  const handleExecute = () => {
    executeWorkflow.mutate({
      id: workflowId,
    });
  };
  return (
    <div>
      <Button
        size="lg"
        onClick={handleExecute}
        disabled={executeWorkflow.isPending}
      >
        <FlaskConicalIcon className="size-4" />
        Execute Workflow
      </Button>
    </div>
  );
};

export default ExecuteWorkflowButton;
