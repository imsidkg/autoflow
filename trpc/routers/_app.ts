import { credentialsRouter } from "@/features/credentials/server/route";
import { createTRPCRouter } from "../init";

import { workflowsRouter } from "@/features/workflows/server/route";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credential: credentialsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
