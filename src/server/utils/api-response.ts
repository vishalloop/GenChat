import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export default function erroResponse<T> (error : T) : NextResponse {
    if(error instanceof Error && "statusCode" in error) {
        const status = Number(error.statusCode);
        return NextResponse.json<ApiResponse>({
            success : false,
            message : error.message,
        },{
            status
        })
    }

    console.error("Unexpected error" , error);
    return NextResponse.json({
        success : false,
        message : "Internal Server Error"
    },{
        status : 500
    })
}