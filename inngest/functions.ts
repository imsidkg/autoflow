import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/lib/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { geminiRequestChannel } from "./channels/gemini";
import { discordChannel } from "./channels/discord";

export const execute = inngest.createFunction(
  { id: "execute-workflow" },
  {
    event: "workflows/execute.workflow",
    channel: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      geminiRequestChannel(),
      discordChannel()
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    });
    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });
      return workflow.userId;
    });

    let context = event.data.initalizeData || {};
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
         userId,
        publish,
      });
    }
    return { workflowId, result: context };
  }
);
