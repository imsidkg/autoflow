import { Editor } from "@/features/editor/components/editor";
import EditorHeader from "@/features/editor/components/editor-header";
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
      <HydrateClient>
        <ErrorBoundary
          fallback={
            <div>
              <WorkflowsError />
            </div>

            // <p>Error</p>
          }
        >
          <Suspense
            fallback={
              <div>
                <WorkflowsLoading />
              </div>

             
            }
          >
            <EditorHeader workflowId={workflowId} />
            <main className="flex-1 h-screen">
              <Editor workflowId={workflowId} />
            </main>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
};

export default page;
