import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const messageSchema = z.object({
  // Makes the ID field entirely optional, but validates format if passed
  chatId: z
    .string()
    .regex(objectIdRegex, { message: "Invalid MongoDB ObjectId format" })
    .optional(),

  // Enforces at least 1 character (allows "?" or massive paragraphs)
  content: z
    .string()
    .min(1, { message: "Question cannot be empty" }),

  userId: z
    .string()
    .regex(objectIdRegex, { message: "Invalid MongoDB ObjectId format" }),
});