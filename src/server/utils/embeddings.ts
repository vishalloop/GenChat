// src/server/utils/embeddings.ts
import { config } from "@/lib/config";
import fetch from "node-fetch";

export async function getMistralEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.mistral.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: config.MISTRAL_EMBED_MODEL ?? "mistral-embed",
      input: text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral embedding error: ${err}`);
  }

  const data = (await response.json()) as { data: { embedding: number[] }[] };
  return data.data[0].embedding;
}