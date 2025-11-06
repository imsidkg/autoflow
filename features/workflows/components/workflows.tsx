'use client'
import React from "react";
import { useSuspenseWorkflow } from "../hooks/use-workflow";
import EntityHeader from "@/components/entity-components";

type Props = {};

const WorkflowsList = (props: Props) => {
  const workflows = useSuspenseWorkflow();
  return <div>{JSON.stringify(workflows.data, null, 2)}</div>;
};

export default WorkflowsList;


export const WorkflowHeader = ({disabled} : {disabled?: Boolean}) => {
    return (
        <div>
            <EntityHeader
            title = "Workflows"
            description=" Create and manage your workflows"
            onNew={() => {}}
            newButtonLabel="New Workflow"
            isCreating = {false}
            />
        </div>
    )
}
