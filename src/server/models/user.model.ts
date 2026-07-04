import { UserDocument } from "@/types/user.types";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<UserDocument>({
    name : {
        type : String,
        required :[true, "Name is required for registration."]
    },
    email: {
        type : String,
        required : [true, "Email is required for registration."],
        unique : [true, "Email should must be unique."]
    },
    password : {
        type : String,
        required : [true , "Password is required for registration."],
    },
    role : {
        type : String,
        required : [true , "Role is required for registration."],
        enum : ["local" , "google" , "github"],
        default : "local"
    },
    googleId : {
        type : String,
        unique : true,
        sparse : true
    }
}, {
    timestamps : true,
});

userSchema.pre("save" , async function () : Promise<void> {
    if(!this.isModified("password")) {
        return;
    };

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePasswrd : string)  : Promise<boolean>{
    return bcrypt.compare(candidatePasswrd, this.password);
}

const userModel = mongoose.models.User || mongoose.model<UserDocument>("User" , userSchema);

export default userModel;