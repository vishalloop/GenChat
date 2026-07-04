import z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
    name : z.string().min(2 , { message : "Name must be 2 characters lomg." }),
    email : z.string().trim().toLowerCase().email( {message : "Please enter valid email address."}),
    password : z.string().min(8 , {message : "Password must be 8 characters long."}).regex(passwordRegex ,{
        message : "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

export const loginSchema = z.object({
    email : z.string().trim().toLowerCase().email( {message : "Please enter valid email address."}),
    password : z.string().min(1 , {message : "Password is required."}),
});