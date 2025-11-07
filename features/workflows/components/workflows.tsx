"use client";
import React from "react";
import { useCreateWorkflow, useSuspenseWorkflow } from "../hooks/use-workflow";
import EntityHeader, {
  EmptyView,
  EntitiyContainer,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

type Props = {};

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search workflows"
    />
  );
};

const WorkflowsList = (props: Props) => {
  const workflows = useSuspenseWorkflow();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <p>{workflow.name}</p>}
      emptyView={<WorkflowsEmpty />}
    />
  );
};

export default WorkflowsList;

export const WorkflowsHeader = ({ disabled }: { disabled?: Boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
        console.error(error);
      },
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
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

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflow();
  const [params, setParams] = useWorkflowParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView entity="workflows" />;
};
export const WorkflowsError = () => {
  return <ErrorView message="Error loading workflows" />;
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntitiyContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntitiyContainer>
  );
};

const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EmptyView
        message="You haven't created any workflows yet. Get started by creating your first workflow"
        onNew={handleCreate}
      />
    </>
  );
};
