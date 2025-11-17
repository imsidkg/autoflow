import { NodeExecutor } from "@/features/executions/type";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};

Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(jsonString);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to serialize context to JSON: ${msg}`);
  }
});

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(httpRequestChannel().status({ nodeId, status: "loading" }));

  try {
    const result = await step.run("http-request", async () => {
      if (!data.endpoint || !data.method || !data.variableName) {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          " HTTP Request Node: Missing endpoint or method or variable name."
        );
      }
      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;
      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const compiledBody = Handlebars.compile(data.body ?? "{}")(context);
        JSON.parse(compiledBody); // Validate JSON before sending
        options.body = compiledBody;
        options.headers = { "Content-Type": "application/json" };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });

    await publish(httpRequestChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
