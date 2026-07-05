import { getCurrentUser } from "@/server/auth/get-current-user";
import { getChats } from "@/server/dao/chat.dao";
import { ApiError } from "@/server/utils/api-error";
import errorResponse from "@/server/utils/api-response";
import { ApiResponse } from "@/types/api.types";
import { chatResponse } from "@/types/chat.types";
import { NextResponse } from "next/server";

export async function GET() : Promise<NextResponse> {
    try {
        
        const user = await getCurrentUser();

        const chats = await getChats(user._id.toString());

        if(!chats) {
            throw new ApiError("Chats not found for the given user" , 404);
        }

        return NextResponse.json<ApiResponse<chatResponse>>({
            success : true,
            message : "Chats fetched successfull.",
            data : {
                chat : chats,
            }
        },{
            status : 200,
        })


    } catch (error) {
        return errorResponse(error);
    }
}