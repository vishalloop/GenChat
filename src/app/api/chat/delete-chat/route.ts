import { getCurrentUser } from "@/server/auth/get-current-user";
import { deleteChat } from "@/server/dao/chat.dao";
import { deleteMessages } from "@/server/dao/message.dao";
import { ApiError } from "@/server/utils/api-error";
import errorResponse from "@/server/utils/api-response";
import { deleteChatSchema } from "@/server/validators/chat.validator";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req : NextRequest) : Promise<NextResponse> {
    try {

        const body = req.json();

        const result = deleteChatSchema.safeParse(body);
        
        if(!result.success) {
            throw new ApiError(result.error.issues[0].message , 400);
        };

        await getCurrentUser();

        const { data } = result;

        const deletedChat = await deleteChat(data);

        if(!deletedChat) {
            throw new ApiError("Chat Id was not found.", 404);
        }

        await deleteMessages(data);

        return NextResponse.json<ApiResponse>({
            success : true,
            message : "Chats deleted successfully."
        },{
            status : 200
        })

    } catch (error) {
        return errorResponse(error);
    }
}