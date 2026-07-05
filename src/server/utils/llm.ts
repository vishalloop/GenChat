import { config } from "@/lib/config";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: config.GROQ_MODEL,
  apiKey: config.GROQ_API_KEY,
});


export async function askLLM(prompt: string): Promise<string> {
  const response = await llm.invoke([new HumanMessage(prompt)]);
  return response.text;
}


export async function* streamLLM(prompt: string): AsyncIterable<string> {
  const stream = await llm.stream([new HumanMessage(prompt)]);
  for await (const chunk of stream) {
    if (chunk.content) {
      yield chunk.content as string;
    }
  }
}