import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().min(3).max(30),
    email: z.email(),
    password: z.string()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/,
            "Password must contain at least one uppercase, one lowercase, one number and one special character")
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(20)
})

export const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/,
            "Password must contain at least one uppercase, one lowercase, one number and one special character"),

    confirmPassword: z.string().min(8).max(20)
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
