import z from "zod";

export const profileSchema = z.object({
    fullName: z.string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be 50 characters or less"),
    image: z.any().optional(),
})