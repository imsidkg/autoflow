import { NodeExecutor } from "@/features/executions/type";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { geminiRequestChannel } from "@/inngest/channels/gemini";
import prisma from "@/lib/db";

type GeminiData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});
export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  userId,
  step,
  publish,
}) => {
  await publish(
    geminiRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.credentialId) {
    await publish(
      geminiRequestChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Gemini node: Credential is required");
  }

  if (!data.variableName) {
    await publish(
      geminiRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Gemini Node: Variable name is missing");
  }
  if (!data.userPrompt) {
    await publish(
      geminiRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Gemini Node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId
      },
    });
  });

  if (!credential) {
    throw new NonRetriableError("Gemini node: Credential not found");
  }

 const google = createGoogleGenerativeAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(data.model || "gemini-1.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      geminiRequestChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [String(data.variableName)]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      geminiRequestChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
};
