import { NodeExecutor } from "@/features/executions/type";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogelFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogelFormTriggerData> = async ({
  nodeId,
  context,
  step,
  publish
}) => {
  // TODO: Publish "loading" state for manual trigger

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status : "loading"
    })
  )

  const result = await step.run("google-form-trigger", async () => context);

  // TODO: Publish "success" state for manual trigger
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status : "success"
    })
  )

  return result;
};
