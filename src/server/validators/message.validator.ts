import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const messageSchema = z.object({
  chatId: z
    .string()
    .regex(objectIdRegex, { message: "Invalid MongoDB ObjectId format" })
    .optional(),

  content: z
    .string()
    .min(1, { message: "Question cannot be empty" }),

  userId: z
    .string()
    .regex(objectIdRegex, { message: "Invalid MongoDB ObjectId format" }),
});

export const streamMeassageSchema = z.object({
  chatId: z.string().regex(objectIdRegex).optional(),
  content: z.string().min(1, "Message cannot be empty"),
});