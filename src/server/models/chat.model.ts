import { IChat } from "@/types/chat.types";
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema<IChat>({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "User is required"],
    },
    title : {
        type : String,
        required : [true, "Title is required"]
    }
},{
    timestamps  : true,
});

const ChatModel = mongoose.models.Chat || mongoose.model("Chat" , chatSchema);

export default ChatModel;