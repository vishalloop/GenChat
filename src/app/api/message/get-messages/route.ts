// src/app/api/message/get-messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { getMessages } from "@/server/dao/message.dao";
import { ApiError } from "@/server/utils/api-error";
import errorResponse from "@/server/utils/api-response";
import { connectToDB } from "@/lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDB();
    await getCurrentUser();

    const chatId = request.nextUrl.searchParams.get("chatId");
    if (!chatId) {
      throw new ApiError("chatId query parameter is required", 400);
    }

    const messages = await getMessages(chatId);

    return NextResponse.json({
      success: true,
      message: "Messages fetched successfully.",
      data: { messages },
    });
  } catch (err) {
    return errorResponse(err);
  }
}