import { NextRequest, NextResponse } from "next/server";
import { handleCreateMessage } from "@/server/services/message.service";
import { getCurrentUser } from "@/server/auth/get-current-user";
import errorResponse from "@/server/utils/api-response";
import { ApiError } from "@/server/utils/api-error";
import { ApiResponse } from "@/types/api.types";
import { messsageResponse } from "@/types/message.types";
import { connectToDB } from "@/lib/db";
import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const bodySchema = z.object({
  chatId: z.string().regex(objectIdRegex).optional(),
  content: z.string().min(1, "Message cannot be empty"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDB();
    const user = await getCurrentUser();

    const body = await request.json();
    const result = bodySchema.safeParse(body);

    if (!result.success) {
      throw new ApiError(result.error.issues[0].message, 400);
    }

    const { chatId, content } = result.data;

    const data = await handleCreateMessage({
      chatId,
      content,
      userId: user._id.toString(),
    });

    return NextResponse.json<ApiResponse<messsageResponse>>({
      success: true,
      message: "Message created successfully.",
      data: {
        chatId: data.chatId,
        answer: data.answer,
        userMessageId: data.userMessageId,
        assistantMessageId: data.assistantMessageId,
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}