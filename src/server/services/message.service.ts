// src/server/services/message.service.ts
import {
  createMessage as daoCreateMessage,
  getMessages as daoGetMessages,
} from "@/server/dao/message.dao";
import { createChat as daoCreateChat } from "@/server/dao/chat.dao"; // you’ll create this
import { getMistralEmbedding } from "@/server/utils/embeddings";
import {
  upsertMessageVector,
  querySimilar,
  initPinecone,
} from "@/server/utils/pineconeClient";
import { askLLM } from "@/server/utils/llm";
import type { IMessage } from "@/types/message.types";

await initPinecone(); // ensure client is ready (executed once per server start)

const RAG_TOP_K = 4; // number of similar chunks fed to the LLM

/** Generate a short title from the first user message (fallback) */
async function generateChatTitle(firstMessage: string): Promise<string> {
  const prompt = `Summarize the following user request in 4–6 words, suitable as a chat title:\n\n"${firstMessage}"`;
  return (await askLLM(prompt)).trim();
}

/**
 * Main entry point called by the API route.
 *
 * @param payload  { chatId?, content }  (content = user question)
 * @returns { chatId, answer, messageId }
 */
export async function handleCreateMessage(payload: {
  chatId?: string;
  content: string;
  userId: string; // you probably have auth middleware populating this
}) {
  const { chatId, content, userId } = payload;

  // -----------------------------------------------------------------
  // 1️⃣  Chat handling – create a new chat if none supplied
  // -----------------------------------------------------------------
  let effectiveChatId = chatId;
  if (!effectiveChatId) {
    const title = await generateChatTitle(content);
    const newChat = await daoCreateChat({
      user: userId,
      title,
    });
    effectiveChatId = newChat._id.toString();
  }

  // -----------------------------------------------------------------
  // 2️⃣  Persist the raw message
  // -----------------------------------------------------------------
  const message: IMessage = {
    chat: effectiveChatId,
    user: userId,
    content,
    role: "user",
    createdAt: new Date(),
  };
  const savedMessage = await daoCreateMessage(message);
  const messageId = savedMessage._id.toString();

  // -----------------------------------------------------------------
  // 3️⃣  Compute embedding & upsert to Pinecone
  // -----------------------------------------------------------------
  const embedding = await getMistralEmbedding(content);
  await upsertMessageVector(messageId, embedding, {
    chatId: effectiveChatId,
    userId,
    role: "user",
  });

  // -----------------------------------------------------------------
  // 4️⃣  RAG – retrieve similar past messages (exclude the just‑saved one)
  // -----------------------------------------------------------------
  const similar = await querySimilar(embedding, RAG_TOP_K, {
    chatId: effectiveChatId,
    // optionally filter out the current vector id
    // (Pinecone does not return the exact same vector if you exclude it)
  });

  // Pull full texts for the matched ids
  const similarIds = similar.filter((m) => m.id !== messageId).map((m) => m.id);
  const similarMessages = similarIds.length
    ? await daoGetMessagesByIds(similarIds) // helper we’ll add
    : [];

  const context = similarMessages
    .map((msg) => `User: ${msg.content}`)
    .join("\n");

  // -----------------------------------------------------------------
  // 5️⃣  Build LLM prompt (RAG)
  // -----------------------------------------------------------------
  const llmPrompt = `
You are a helpful AI assistant for a chat application.

Chat history (most relevant ${similar.length} messages):
${context ? context : "(none)"}

Current user question:
${content}

Answer concisely and in plain language. Do not repeat the question.`.trim();

  const answer = await askLLM(llmPrompt);

  // -----------------------------------------------------------------
  // 6️⃣  Save the assistant's answer as a new Message (optional but convenient)
  // -----------------------------------------------------------------
  const assistantMsg: IMessage = {
    chat: effectiveChatId,
    user: userId,
    content: answer,
    role: "assistant",
    createdAt: new Date(),
  };
  const savedAssistant = await daoCreateMessage(assistantMsg);
  const assistantId = savedAssistant._id.toString();

  // -----------------------------------------------------------------
  // 7️⃣  Return response to the client
  // -----------------------------------------------------------------
  return {
    chatId: effectiveChatId,
    userMessageId: messageId,
    assistantMessageId: assistantId,
    answer,
  };
}

/* -----------------------------------------------------------------
   Helper: fetch many messages by id (used for RAG)
   ----------------------------------------------------------------- */
import MessageModel from "@/server/models/message.model";
async function daoGetMessagesByIds(ids: string[]) {
  return await MessageModel.find({ _id: { $in: ids } })
    .select("content role")
    .lean()
    .exec();
}
