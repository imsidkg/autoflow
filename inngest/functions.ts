import { fi } from "date-fns/locale";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";

export const execute = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }

    const nodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });
      return workflow.nodes
    });
    console.log(nodes)
    return {nodes}
  }
);
