import WorkflowsList, {
  WorkflowsContainer,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {};

const page = async (props: Props) => {
  await requireAuth();
  prefetchWorkflows();
  return (
    <div>
      <WorkflowsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<div>Error!</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <WorkflowsList />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </WorkflowsContainer>
    </div>
  );
};

export default page;
