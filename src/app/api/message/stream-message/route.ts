import { NextRequest } from "next/server";
import { handleStreamMessage } from "@/server/services/message.service";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { ApiError } from "@/server/utils/api-error";
import { connectToDB } from "@/lib/db";
import errorResponse from "@/server/utils/api-response";
import { streamMeassageSchema } from "@/server/validators/message.validator";


export async function POST(request: NextRequest) {
  let userId: string;
  let chatId: string | undefined;
  let content: string;

  try {
    await connectToDB();
    const user = await getCurrentUser();
    userId = user._id.toString();

    const body = await request.json();
    const result = streamMeassageSchema.safeParse(body);
    if (!result.success) {
      throw new ApiError(result.error.issues[0].message, 400);
    }
    chatId = result.data.chatId;
    content = result.data.content;
  } catch (err) {
        errorResponse(err);
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: string) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      await handleStreamMessage({
        chatId,
        content,
        userId,
        onChunk: (chunk) => {
          send("chunk", chunk);
        },
        onDone: (_fullAnswer, resolvedChatId) => {
          send("done", resolvedChatId);
          controller.close();
        },
        onError: (err) => {
          send("error", err.message);
          controller.close();
        },
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}