// src/app/api/message/create-message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleCreateMessage } from "@/server/services/message.service";
import errorResponse from "@/server/utils/api-response";
import { messageSchema } from "@/server/validators/message.validator";
import { ApiError } from "@/server/utils/api-error";
import { ApiResponse } from "@/types/api.types";
import { messsageResponse } from "@/types/message.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = messageSchema.safeParse(body);

    if(!validationResult.success) {
        throw new ApiError(validationResult.error.issues[0].message , 400);
    }

    // ---- validation -------------------------------------------------
    const { data } = validationResult;
    if (!data.content || typeof data.content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `content` field." },
        { status: 400 }
      );
    }
    if (!data.userId || typeof data.userId !== "string") {
      // In a real app you would pull the user from a session / JWT
      return NextResponse.json(
        { error: "Missing `userId` – authentication required." },
        { status: 401 }
      );
    }

    // ---- core logic ------------------------------------------------
    const result = await handleCreateMessage(data);

    // ---- success response -------------------------------------------
    return NextResponse.json<ApiResponse<messsageResponse>>({
      success: true,
      message : "Message created successfully.",
      data : {
          chatId: result.chatId,
          answer: result.answer,
          userMessageId: result.userMessageId,
          assistantMessageId: result.assistantMessageId,
      }
    });
  } catch (err) {
    errorResponse(err);
  }
}