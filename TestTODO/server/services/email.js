import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ------------------------------------------------------------------ */
/* CONFIG                                                             */
/* ------------------------------------------------------------------ */

const APP_NAME = "Focus TODO";
const FROM_EMAIL = process.env.EMAIL_USER;
const CLIENT_URL = process.env.CLIENT_URL;

if (!FROM_EMAIL || !process.env.EMAIL_PASS || !CLIENT_URL) {
    throw new Error("Missing EMAIL_USER, EMAIL_PASS, or CLIENT_URL in .env");
}

const FROM = `"${APP_NAME}" <${FROM_EMAIL}>`;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: FROM_EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

/* ------------------------------------------------------------------ */
/* BASE EMAIL TEMPLATE                                                 */
/* ------------------------------------------------------------------ */

const baseEmailTemplate = ({
    title,
    message,
    buttonText,
    buttonUrl,
    footerText,
}) => `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 50px 0; margin: 0;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb;">
      
      <!-- Gradient Header Bar -->
      <div style="height: 6px; background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);"></div>
      
      <div style="padding: 40px;">
        <!-- Logo / App Name -->
        <div style="margin-bottom: 32px; text-align: left;">
          <span style="font-size: 24px; font-weight: 800; color: #4f46e5; letter-spacing: -0.025em; display: flex; align-items: center; gap: 8px;">
            Focus TODO
          </span>
        </div>

        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 700; line-height: 1.2;">
          ${title}
        </h2>

        <div style="color: #4b5563; line-height: 1.6; font-size: 16px; margin-bottom: 32px;">
          ${message}
        </div>

        ${buttonUrl
        ? `
          <div style="margin: 32px 0;">
            <a href="${buttonUrl}"
               style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px;
                      border-radius: 10px; text-decoration: none; font-weight: 600;
                      display: inline-block; font-size: 16px; transition: background-color 0.2s;">
              ${buttonText}
            </a>
          </div>
        `
        : ""
    }

        <div style="padding: 24px 0 0 0; border-top: 1px solid #f3f4f6; margin-top: 32px;">
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px; line-height: 1.5;">
            ${footerText}
          </p>
          
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          © ${new Date().getFullYear()} ${APP_NAME}. Built for focus.
        </p>
      </div>
    </div>
  </div>
`;

/* ------------------------------------------------------------------ */
/* EMAIL FUNCTIONS                                                     */
/* ------------------------------------------------------------------ */

// ✅ Email Verification
export const sendVerificationEmail = async (email, token) => {
    const url = `${CLIENT_URL}/verify-email/${token}`;

    await transporter.sendMail({
        from: FROM,
        to: email,
        subject: "Verify your email address",
        html: baseEmailTemplate({
            title: "Verify your email",
            message: `
        Welcome to <strong>${APP_NAME}</strong> 👋 <br /><br />
        Please confirm your email address to activate your account.
      `,
            buttonText: "Verify Email",
            buttonUrl: url,
            footerText: "This verification link will expire in 24 hours.",
        }),
    });
};

// ✅ Reset Password
export const sendResetPasswordEmail = async (email, token) => {
    const url = `${CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
        from: FROM,
        to: email,
        subject: "Reset your password",
        html: baseEmailTemplate({
            title: "Reset your password",
            message: `
        We received a request to reset your password.<br /><br />
        Click the button below to choose a new one.
      `,
            buttonText: "Reset Password",
            buttonUrl: url,
            footerText: "This reset link will expire in 1 hour.",
        }),
    });
};

// ✅ Task Reminder / Notification
export const sendTaskNotification = async (email, taskTitle) => {
    await transporter.sendMail({
        from: FROM,
        to: email,
        subject: "Task reminder",
        html: baseEmailTemplate({
            title: "Task Reminder",
            message: `
        Your task <strong>${taskTitle}</strong> is overdue.<br /><br />
        Stay focused and get it done 💪
      `,
            buttonText: null,
            buttonUrl: null,
            footerText: `Stay productive with ${APP_NAME}.`,
        }),
    });
};
