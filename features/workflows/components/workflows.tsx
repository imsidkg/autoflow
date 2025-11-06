"use client";
import React from "react";
import { useSuspenseWorkflow } from "../hooks/use-workflow";
import EntityHeader, { EntitiyContainer } from "@/components/entity-components";

type Props = {};

const WorkflowsList = (props: Props) => {
  const workflows = useSuspenseWorkflow();
  return <div>{JSON.stringify(workflows.data, null, 2)}</div>;
};

export default WorkflowsList;

export const WorkflowsHeader = ({ disabled }: { disabled?: Boolean }) => {
  return (
    <div>
      <EntityHeader
        title="Workflows"
        description=" Create and manage your workflows"
        onNew={() => {}}
        newButtonLabel="New Workflow"
        isCreating={false}
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
