"use client";
import React from "react";
import { useCreateWorkflow, useSuspenseWorkflow } from "../hooks/use-workflow";
import EntityHeader, { EntitiyContainer } from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

type Props = {};

const WorkflowsList = (props: Props) => {
  const workflows = useSuspenseWorkflow();
  return <div>{JSON.stringify(workflows.data, null, 2)}</div>;
};

export default WorkflowsList;

export const WorkflowsHeader = ({ disabled }: { disabled?: Boolean }) => {
  const router = useRouter()
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        
        handleError(error);
        console.error(error);
      },
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`)
      }
    });
  };
  return (
    <div>
      {modal}
      <EntityHeader
        title="Workflows"
        description=" Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflow"
        isCreating={createWorkflow.isPending}
      />
    </div>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntitiyContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntitiyContainer>
  );
};
