import { NodeExecutor } from "@/features/executions/type";

type HttpRequestData = Record<string, unknown>;

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for HTTP request

  const result = await step.run("http-request", async () => context);

  // TODO: Publish "success" state for HTTP request

  return result;
};
