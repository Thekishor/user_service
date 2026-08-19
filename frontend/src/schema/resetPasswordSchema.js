import z from "zod";

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(1, "New password is required")
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must not exceed 20 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"]
    })