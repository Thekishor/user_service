
export const verifyEmailTemplate = (verifyUrl: string) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 32px 28px; color: #222; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px;">

      <h2 style="margin: 0 0 16px; font-size: 24px; text-align: center;">
        Verify Your Email 
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #555;">
        Thanks for creating your account! Please verify your email address to complete your registration.
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a
          href="${verifyUrl}"
          target="_blank"
          rel="noopener noreferrer"
            style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 7px; font-size: 15px; font-weight: 600;"
          >
            Verify Email
          </a>
        </div>

      <p style="font-size: 13px; line-height: 1.5; color: #777;">
        This verification link will expire in <strong>24 hours</strong>.
      </p>

      <p style="font-size: 13px; line-height: 1.5; color: #777;">
        If you didn't create this account, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 28px 0;">

      <p style="margin: 0; text-align: center; font-size: 12px; color: #999;">
        This is an automated email. Please do not reply.
      </p>

    </div>
    `;
};

export const resetPasswordTemplate = (resetPasswordUrl: string) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 32px 28px; color: #222; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px;">

      <h2 style="margin: 0 0 16px; font-size: 24px; text-align: center;">
        Reset Your Password
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #555;">
        We received a request to reset your password. Click the button below to create a new password.
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a
          href="${resetPasswordUrl}"
          target="_blank"
          rel="noopener noreferrer"
          style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 7px; font-size: 15px; font-weight: 600;"
        >
          Reset Password
        </a>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #777;">
        This password reset link will expire in <strong>15 minutes</strong>.
      </p>

      <p style="font-size: 13px; line-height: 1.5; color: #777;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 28px 0;">

      <p style="margin: 0; text-align: center; font-size: 12px; color: #999;">
        This is an automated email. Please do not reply.
      </p>

    </div>
  `;
};