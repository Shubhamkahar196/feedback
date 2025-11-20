import z from "zod"

export const MessageSchema = z.object({
    content: z.string().min(5, "Content must be at least of 5 characters")
    .max(300, "Content must be no longer then 300 characters")
})