import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const deleteChatSchema = z.string().regex(objectIdRegex, {
  message: "Invalid ID format. Must be a 24-character hex string.",
});