import WorkflowsList, {
  WorkflowsContainer,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows";
import { workflowParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams:Promise<SearchParams>
};

const page = async ({searchParams}: Props) => {
  await requireAuth();

  const params = await workflowParamsLoader(searchParams)
  prefetchWorkflows(params);
  return (
    <div>
      <WorkflowsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<div>Error!</div>}>
            <Suspense fallback={<div><WorkflowsLoading/></div>}>
              <WorkflowsList />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </WorkflowsContainer>
    </div>
  );
};

export default page;
