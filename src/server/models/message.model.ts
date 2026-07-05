import { IMessage } from "@/types/message.types";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema<IMessage>({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "UserId is required."]
    },
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat",
        required : [true, "ChatId is required."]
    },
    content : {
        type : String,
        required : [true, "Content is required"],
    },
    role : {
        type : String,
        enum : ["user" , "ai"],
        required : [true, "Role is required."],
    },
},{
    timestamps : true,
});

const MessageModel = mongoose.models.Message || mongoose.model("Message" , messageSchema);

export default MessageModel;