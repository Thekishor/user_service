import { z } from "zod";

const phoneRegex = /^(97[01456]|98[012456])\d{7}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

const passwordField = z
    .string()
    .superRefine((value, ctx) => {
        if (value.length < 8 || value.length > 20) {
            ctx.addIssue({
                code: "custom",
                message: "Password must be between 8 and 20 characters.",
            });
            return;
        }

        if (!passwordRegex.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Password must include an uppercase letter, lowercase letter, number, and special character.",
            });
        }
    });

export const registerSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters").max(50, "Full name must be 50 characters or less"),
    email: z.email().trim().toLowerCase(),
    phone: z.string()
        .min(1, "Phone number is required")
        .transform(val => val.trim().replace(/[\s-]/g, ""))
        .refine(val => phoneRegex.test(val), {
            message: "Invalid phone number",
        }),
    password: passwordField
});

export const loginSchema = z.object({
    identifier: z.string()
        .trim()
        .min(1, "Email or phone is required")
        .refine((value) => {
            const email = z.email().safeParse(value.toLowerCase()).success;
            const phone = phoneRegex.test(value);

            return email || phone;
        }, {
            message: "Invalid email or phone number",
        }),
    password: z.string().min(1, "Password is required")
});

export const resetPasswordSchema = z.object({
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Password is required"),
    newPassword: passwordField,
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
})

export const profileSchema = z.object({
    fullName: z.string()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must be 50 characters or less"),
})

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type ProfileSchemaDto = z.infer<typeof profileSchema>;
