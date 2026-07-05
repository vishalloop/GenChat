// src/server/utils/llm.ts
import { config } from "@/lib/config";
import fetch from "node-fetch";

export async function askLLM(prompt: string): Promise<string> {
  // Example using OpenAI / Gemini — replace with Mistral if you prefer
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: config.GROQ_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}