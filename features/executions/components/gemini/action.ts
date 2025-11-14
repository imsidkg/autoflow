"use server";

import { geminiRequestChannel } from "@/inngest/channels/gemini";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";


export type GeminiToken = Realtime.Token<
  typeof geminiRequestChannel,
  ["status"]
>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: geminiRequestChannel(),
    topics: ["status"],
  });

  return token;
}
