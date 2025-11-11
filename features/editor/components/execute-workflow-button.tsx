import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";

const ExecuteWorkflowButton = ({ workflowId }: { workflowId: String }) => {
  return (
    <div>
      <Button size="lg" onClick={() => {}}>
        <FlaskConicalIcon className="size-4" />
        Execute Workflow
      </Button>
    </div>
  );
};

export default ExecuteWorkflowButton;
