import z from "zod";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import {
  type CredentialType,
  type NodeType,
  NodeType as PrismaNodeType,
  CredentialType as PrismaCredentialType,
} from "@/lib/generated/prisma";

export type GraphPlan = {
  nodes: Array<{
    key: string;
    type: NodeType;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }>;
  edges: Array<{
    from: string;
    to: string;
    fromOutput: string;
    toInput: string;
  }>;
};

const positionSchema = z.object({
  x: z.coerce.number(),
  y: z.coerce.number(),
});

const graphPlanSchema = z.object({
  nodes: z.array(
    z.object({
      key: z.string().min(1),
      type: z.nativeEnum(PrismaNodeType),
      position: positionSchema.optional(),
      data: z.record(z.string(), z.any()).optional(),
    })
  ),
  edges: z.array(
    z.object({
      from: z.string().min(1),
      to: z.string().min(1),
      fromOutput: z.string().optional(),
      toInput: z.string().optional(),
    })
  ),
});

type GraphPlanRaw = z.infer<typeof graphPlanSchema>;

const variableNameRegex = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function sanitizeVariableName(value: unknown, fallback: string) {
  const raw = typeof value === "string" ? value : "";
  if (raw && variableNameRegex.test(raw)) return raw;

  // Replace invalid characters with underscore and ensure a valid prefix.
  const replaced = raw
    .trim()
    .replace(/[^A-Za-z0-9_$]/g, "_")
    .replace(/^([0-9]+)/, "_$1");

  if (replaced && variableNameRegex.test(replaced)) return replaced;
  return fallback;
}

function extractJson(text: string) {
  // Handle ```json fences and "Return only JSON" cases.
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Model output did not contain JSON object braces");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function normalizeNodeType(value: unknown): unknown {
  if (typeof value !== "string") return value;

  // Handle values like "\"GEMINI\"" or "'GEMINI'".
  const stripped = value.trim().replace(/^['"]+|['"]+$/g, "");
  const upper = stripped.toUpperCase();

  const allowed = new Set(Object.values(PrismaNodeType));
  if (allowed.has(upper as NodeType)) return upper;
  return stripped;
}

function normalizeGraphPlanPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const p = payload as Record<string, unknown>;

  const nodes = Array.isArray(p.nodes) ? p.nodes : [];
  const edges = Array.isArray(p.edges) ? p.edges : [];

  return {
    ...p,
    nodes: nodes.map((node) => {
      if (!node || typeof node !== "object") return node;
      const n = node as Record<string, unknown>;
      return {
        ...n,
        type: normalizeNodeType(n.type),
      };
    }),
    edges,
  };
}

function safeString(value: unknown, fallback: string) {
  if (typeof value === "string") return value;
  return fallback;
}

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function generateGraphPlanFromInstructions(params: {
  instructions: string;
  credentialIdByType: Partial<Record<CredentialType, string>>;
}): Promise<GraphPlan> {
  const { instructions, credentialIdByType } = params;

  const SYSTEM_PROMPT = [
    "You are an assistant that designs Autoflow workflow graphs.",
    "Return ONLY a valid JSON object that matches the provided schema.",
    "Do NOT include markdown fences, comments, or extra text.",
    "",
    "GraphPlan schema:",
    "{",
    '  "nodes": [',
    '    { "key": "string", "type": "NodeType", "position": {"x": number, "y": number}, "data": { "any": "any" } }',
    "  ],",
    '  "edges": [',
    '    { "from": "nodeKey", "to": "nodeKey", "fromOutput": "source-1", "toInput": "target-1" }',
    "  ]",
    "}",
    "",
    "Node rules:",
    "- Do not include NODE type INITIAL unless explicitly requested.",
    '- Avoid more than one MANUAL_TRIGGER node.',
    '- For any AI node (OPENAI/ANTHROPIC/GEMINI), include `credentialId` if you can; it may be empty and will be filled by the server.',
    "- For any node that writes `variableName` (HTTP_REQUEST, OPENAI, ANTHROPIC, GEMINI, DISCORD), ensure `variableName` is compatible with /^[A-Za-z_$][A-Za-z0-9_$]*$/.",
    "",
    "Position rules:",
    "- Put nodes in a left-to-right chain with spacing ~250-350px.",
    "- Use y offsets if needed to avoid overlap, but keep it simple.",
  ].join("\n");

  const prompt = [
    "User instructions:",
    instructions,
    "",
    "Design the smallest plausible graph that satisfies the instructions.",
  ].join("\n");

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  const chosen = (() => {
    if (openaiKey) return "openai";
    if (anthropicKey) return "anthropic";
    if (googleKey) return "google";
    return null;
  })();

  if (!chosen) {
    throw new Error(
      "No LLM API key configured. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_GENERATIVE_AI_API_KEY."
    );
  }

  const result = await generateText({
    model:
      chosen === "openai"
        ? createOpenAI({ apiKey: openaiKey! })("gpt-4o-mini")
        : chosen === "anthropic"
          ? createAnthropic({ apiKey: anthropicKey! })("claude-3-5-sonnet-20241022")
          : createGoogleGenerativeAI({ apiKey: googleKey! })("gemini-2.0-flash"),
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.2,
  });

  const jsonText = extractJson(result.text);
  const rawJson = JSON.parse(jsonText);
  const normalizedJson = normalizeGraphPlanPayload(rawJson);
  const parsed: GraphPlanRaw = graphPlanSchema.parse(normalizedJson);

  // Post-process to match executor/UI expectations.
  const manualTriggerNodes = parsed.nodes.filter(
    (n) => n.type === PrismaNodeType.MANUAL_TRIGGER
  );
  let keepManualTriggerKey: string | null = null;
  if (manualTriggerNodes.length > 0) {
    keepManualTriggerKey = manualTriggerNodes[0].key;
  }

  const cleanedNodes: GraphPlan["nodes"] = parsed.nodes
    .filter((n) => n.type !== PrismaNodeType.INITIAL)
    .filter((n) => {
      if (n.type !== PrismaNodeType.MANUAL_TRIGGER) return true;
      if (!keepManualTriggerKey) return true;
      return n.key === keepManualTriggerKey;
    })
    .map((n, index) => {
      const data = (n.data ?? {}) as Record<string, unknown>;
      const position = n.position ?? { x: index * 300, y: 0 };

      const defaults = {
        HTTP_REQUEST: {
          variableName: "httpResponse",
          endpoint: "",
          method: "GET",
          body: "",
        },
        OPENAI: {
          variableName: "openAiResult",
          systemPrompt: "",
          userPrompt: instructions,
          model: "gpt-4o",
        },
        ANTHROPIC: {
          variableName: "anthropicResult",
          systemPrompt: "",
          userPrompt: instructions,
          model: "claude-3-5-sonnet-20241022",
        },
        GEMINI: {
          variableName: "geminiResult",
          systemPrompt: "",
          userPrompt: instructions,
          model: "gemini-2.0-flash",
        },
        DISCORD: {
          variableName: "discordResult",
          webhookUrl: "",
          content: instructions,
          username: "",
        },
      };

      if (n.type === PrismaNodeType.HTTP_REQUEST) {
        const d = defaults.HTTP_REQUEST;
        const method = safeString(data.method ?? d.method, d.method).toUpperCase();
        const allowedMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

        return {
          ...n,
          position,
          data: {
            ...data,
            variableName: sanitizeVariableName(
              data.variableName ?? d.variableName,
              d.variableName
            ),
            endpoint: safeString(data.endpoint ?? d.endpoint, d.endpoint),
            method: allowedMethods.has(method as any) ? method : ("GET" as any),
            body: safeString(data.body ?? d.body, d.body),
          },
        };
      }

      if (n.type === PrismaNodeType.OPENAI) {
        const d = defaults.OPENAI;
        const credentialId =
          (typeof data.credentialId === "string" && data.credentialId.trim()) ||
          credentialIdByType[PrismaCredentialType.OPENAI];

        return {
          ...n,
          position,
          data: {
            ...data,
            credentialId: credentialId ?? "",
            variableName: sanitizeVariableName(
              data.variableName ?? d.variableName,
              d.variableName
            ),
            systemPrompt: safeString(data.systemPrompt ?? d.systemPrompt, ""),
            userPrompt: safeString(
              data.userPrompt ?? (isNonEmptyString(instructions) ? instructions : d.userPrompt),
              d.userPrompt
            ),
            model: safeString(data.model ?? d.model, d.model),
          },
        };
      }

      if (n.type === PrismaNodeType.ANTHROPIC) {
        const d = defaults.ANTHROPIC;
        const credentialId =
          (typeof data.credentialId === "string" && data.credentialId.trim()) ||
          credentialIdByType[PrismaCredentialType.ANTHROPIC];

        return {
          ...n,
          position,
          data: {
            ...data,
            credentialId: credentialId ?? "",
            variableName: sanitizeVariableName(
              data.variableName ?? d.variableName,
              d.variableName
            ),
            systemPrompt: safeString(data.systemPrompt ?? d.systemPrompt, ""),
            userPrompt: safeString(
              data.userPrompt ?? (isNonEmptyString(instructions) ? instructions : d.userPrompt),
              d.userPrompt
            ),
            model: safeString(data.model ?? d.model, d.model),
          },
        };
      }

      if (n.type === PrismaNodeType.GEMINI) {
        const d = defaults.GEMINI;
        const credentialId =
          (typeof data.credentialId === "string" && data.credentialId.trim()) ||
          credentialIdByType[PrismaCredentialType.GEMINI];

        let model = safeString(data.model ?? d.model, d.model);
        // Your Gemini API rejects `gemini-1.5-flash` in this environment/version.
        // Coerce any 1.5-flash* value to the known-good default.
        if (typeof model === "string" && model.includes("gemini-1.5-flash")) {
          model = "gemini-2.0-flash";
        }

        return {
          ...n,
          position,
          data: {
            ...data,
            credentialId: credentialId ?? "",
            variableName: sanitizeVariableName(
              data.variableName ?? d.variableName,
              d.variableName
            ),
            systemPrompt: safeString(data.systemPrompt ?? d.systemPrompt, ""),
            userPrompt: safeString(
              data.userPrompt ?? (isNonEmptyString(instructions) ? instructions : d.userPrompt),
              d.userPrompt
            ),
            model,
          },
        };
      }

      if (n.type === PrismaNodeType.DISCORD) {
        const d = defaults.DISCORD;
        return {
          ...n,
          position,
          data: {
            ...data,
            variableName: sanitizeVariableName(
              data.variableName ?? d.variableName,
              d.variableName
            ),
            webhookUrl: safeString(data.webhookUrl ?? d.webhookUrl, ""),
            content: safeString(data.content ?? d.content, d.content),
            username: safeString(data.username ?? d.username, ""),
          },
        };
      }

      // Trigger nodes: no required fields.
      return { ...n, position, data };
    });

  const cleanedNodeKeys = new Set(cleanedNodes.map((n) => n.key));

  const cleanedEdges: GraphPlan["edges"] = parsed.edges
    .filter((e) => cleanedNodeKeys.has(e.from) && cleanedNodeKeys.has(e.to))
    .map((e) => ({
      from: e.from,
      to: e.to,
      fromOutput: e.fromOutput ?? "source-1",
      toInput: e.toInput ?? "target-1",
    }));

  // Ensure every edge uses the expected handle ids (for this repo).
  for (const e of cleanedEdges) {
    e.fromOutput = "source-1";
    e.toInput = "target-1";
  }

  return { nodes: cleanedNodes, edges: cleanedEdges };
}

