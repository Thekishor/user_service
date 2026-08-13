import { z } from "zod";

const phoneRegex = /^(97[01456]|98[012456])\d{7}$/;

export const registerSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters").max(50, "Full name must be 50 characters or less"),
    email: z.email().trim().toLowerCase(),
    phone: z.string()
        .min(1, "Phone number is required")
        .transform(val => val.trim().replace(/[\s-]/g, ""))
        .refine(val => phoneRegex.test(val), {
            message: "Invalid phone number",
        }),     
    password: z.string()    
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/,
            "Password must contain at least one uppercase, one lowercase, one number and one special character")
})

export const loginSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/,
        "Password must contain at least one uppercase, one lowercase, one number and one special character"),   
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
