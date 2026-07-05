// src/server/services/message.service.ts
import { createMessage as daoCreateMessage } from "@/server/dao/message.dao";
import { createChat } from "@/server/dao/chat.dao";
import { getMistralEmbedding } from "@/server/utils/embeddings";
import { upsertMessageVector, querySimilar } from "@/server/utils/pineconeClient";
import { askLLM, streamLLM } from "@/server/utils/llm";
import { connectToDB } from "@/lib/db";
import MessageModel from "@/server/models/message.model";
import type { IMessage } from "@/types/message.types";

const RAG_TOP_K = 4;

async function getMessagesByIds(ids: string[]) {
  return await MessageModel.find({ _id: { $in: ids } })
    .select("content role")
    .lean()
    .exec();
}

async function generateChatTitle(firstMessage: string): Promise<string> {
  const prompt = `Generate a crisp chat title (2-5 words) for this message, no quotes:
Message: ${firstMessage}`;
  return (await askLLM(prompt)).trim();
}

async function buildRAGContext(
  embedding: number[],
  chatId: string,
  excludeId: string
): Promise<string> {
  const similar = await querySimilar(embedding, RAG_TOP_K, { chatId });
  const ids = similar.filter((m) => m.id !== excludeId).map((m) => m.id);
  if (!ids.length) return "";

  const docs = await getMessagesByIds(ids);
  return docs
    .map((m) => `${m.role === "ai" ? "Assistant" : "User"}: ${m.content}`)
    .join("\n");
}

function buildLLMPrompt(context: string, question: string): string {
  return `You are GenChat, a helpful AI assistant.
${
  context
    ? `\nRelevant conversation history:\n${context}\n`
    : ""
}
Current user question:
${question}

Answer clearly and helpfully. Use markdown formatting for code, lists, and structure.`.trim();
}


export async function handleCreateMessage(payload: {
  chatId?: string;
  content: string;
  userId: string;
}) {
  const { content, userId } = payload;
  await connectToDB();

  let chatId = payload.chatId;
  if (!chatId) {
    const title = await generateChatTitle(content);
    const newChat = await createChat({ user: userId, title });
    chatId = newChat._id.toString();
  }

  const userMsg: IMessage = { chat: chatId, user: userId, content, role: "user" };
  const savedUserMsg = await daoCreateMessage(userMsg);
  const userMsgId = savedUserMsg._id.toString();

  const embedding = await getMistralEmbedding(content);
  await upsertMessageVector(userMsgId, embedding, { chatId, userId, role: "user" });

  const context = await buildRAGContext(embedding, chatId, userMsgId);

  const prompt = buildLLMPrompt(context, content);
  const answer = await askLLM(prompt);

  const aiMsg: IMessage = { chat: chatId, user: userId, content: answer, role: "ai" };
  const savedAI = await daoCreateMessage(aiMsg);

  return {
    chatId,
    answer,
    userMessageId: userMsgId,
    assistantMessageId: savedAI._id.toString(),
  };
}


export async function handleStreamMessage(payload: {
  chatId?: string;
  content: string;
  userId: string;
  onChunk: (chunk: string) => void;
  onDone: (fullAnswer: string, chatId: string) => void;
  onError: (err: Error) => void;
}) {
  const { content, userId, onChunk, onDone, onError } = payload;

  try {
    await connectToDB();

    let chatId = payload.chatId;
    if (!chatId) {
      const title = await generateChatTitle(content);
      const newChat = await createChat({ user: userId, title });
      chatId = newChat._id.toString();
    }

    const userMsg: IMessage = { chat: chatId, user: userId, content, role: "user" };
    const savedUserMsg = await daoCreateMessage(userMsg);
    const userMsgId = savedUserMsg._id.toString();

    const embedding = await getMistralEmbedding(content);
    await upsertMessageVector(userMsgId, embedding, { chatId, userId, role: "user" });

    const context = await buildRAGContext(embedding, chatId, userMsgId);

    const prompt = buildLLMPrompt(context, content);
    let fullAnswer = "";

    for await (const chunk of streamLLM(prompt)) {
      fullAnswer += chunk;
      onChunk(chunk);
    }

    const aiMsg: IMessage = { chat: chatId, user: userId, content: fullAnswer, role: "ai" };
    await daoCreateMessage(aiMsg);

    onDone(fullAnswer, chatId);
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}