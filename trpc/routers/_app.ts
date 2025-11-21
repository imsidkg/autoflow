import { credentialsRouter } from "@/features/credentials/server/route";
import { createTRPCRouter } from "../init";

import { workflowsRouter } from "@/features/workflows/server/route";
import { executionsRouter } from "@/features/executions/server/routes";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credential: credentialsRouter,
  executions: executionsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
