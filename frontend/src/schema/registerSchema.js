import z from "zod";

export const registerSchema = z.object({
    fullName: z.string().trim().min(1, "Full name is required").min(3, "Full name must be at least 3 characters"),
    email: z.email(),
    phone: z.string().min(1, "Mobile number is required").regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    password: z.string().min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must not exceed 20 characters"),
});