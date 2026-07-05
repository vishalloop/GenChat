import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { deleteChat, getParticularChat } from "@/server/dao/chat.dao";
import { deleteMessages } from "@/server/dao/message.dao";
import { ApiError } from "@/server/utils/api-error";
import errorResponse from "@/server/utils/api-response";
import { connectToDB } from "@/lib/db";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDB();
    const user = await getCurrentUser();

    const chatId = request.nextUrl.searchParams.get("chatId");
    if (!chatId) throw new ApiError("chatId is required", 400);

    const chat = await getParticularChat(chatId);
    if (!chat) throw new ApiError("Chat not found", 404);
    if (chat.user.toString() !== user._id.toString()) {
      throw new ApiError("Forbidden", 403);
    }

    await deleteMessages(chatId);
    await deleteChat(chatId);

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully.",
    });
  } catch (err) {
    return errorResponse(err);
  }
}