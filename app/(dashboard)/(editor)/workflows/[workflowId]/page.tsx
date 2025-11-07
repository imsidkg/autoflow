import Editor from "@/features/editor/components/editor";
import WorkflowsList, {
  WorkflowsError,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{
    workflowId: string;
  }>;
}

const page = async ({ params }: Props) => {
  await requireAuth();

  const { workflowId } = await params;

  prefetchWorkflow(workflowId);
  return (
    <div>
      workflowId : {workflowId}
      <HydrateClient>
        <ErrorBoundary
          fallback={
            // <div>
            //   <WorkflowsError />
            // </div>

            <p>Error</p>
          }
        >
          <Suspense
            fallback={
              // <div>
              //   <WorkflowsLoading />
              // </div>

              <p>Loading</p>
            }
          >
            <Editor workflowId={workflowId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
};

export default page;
