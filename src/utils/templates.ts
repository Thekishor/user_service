
export const verifyEmailTemplate = (verifyUrl: string) => {
    return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; color: #333;">

     <h2>Verify Your Email Address</h2>        

     <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>

     <p style="margin: 24px 0;">
       <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #000; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block;">
         Verify Email
       </a>
     </p>

     <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>

     <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>

     <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

    </div>
    `;
};   