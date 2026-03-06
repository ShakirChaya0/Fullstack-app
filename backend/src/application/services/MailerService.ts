import { createTransport, Transporter } from "nodemailer";
import { getResetPasswordTemplate, getVerificationTemplate } from "../../shared/constants/mailTemplates.js";

export class MailerService {
    private readonly transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify transporter connectivity at startup to surfice issues early in logs (Railway).
        this.transporter.verify()
            .then(() => {
                if (!process.env.EMAIL_USER) {
                    console.warn('[MailerService] EMAIL_USER is not set. Email sending will fail.');
                } else {
                    console.info('[MailerService] Mail transporter is ready. Using user:', process.env.EMAIL_USER);
                }
            })
            .catch((err) => {
                // Provide actionable hints for common Gmail problems.
                console.error('[MailerService] Failed to verify mail transporter. Emails will not be sent.');
                console.error('[MailerService] Common causes: missing/incorrect EMAIL_USER or EMAIL_PASS, Gmail blocking sign-in, or network restrictions.');
                console.error('[MailerService] If you use a Google account, use an App Password (if 2FA enabled) or configure OAuth2. Avoid plain account password.');
                console.error('[MailerService] Verification error:', err?.message ?? err);
            });
    }

    public async sendResetPasswordEmail(userEmail: string, token: string) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const mailBody = getResetPasswordTemplate(resetLink);

        try {
            await this.transporter.sendMail({
                from: `"Soporte Restaurante" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: "Restablece tu contraseña",
                html: mailBody,
            });
        } catch (err: any) {
            console.error(`[MailerService] Failed to send reset password email to ${userEmail}:`, err?.message ?? err);
            // Rethrow so callers (use cases/controllers) can translate into appropriate responses.
            throw err;
        }
    }

    public async sendVerificationEmail(userEmail: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const emailBody = getVerificationTemplate(verifyUrl);

        try {
            await this.transporter.sendMail({
                from: `"Soporte Restaurante" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: "Verifica tu dirección de correo electrónico",
                html: emailBody,
            });
        } catch (err: any) {
            console.error(`[MailerService] Failed to send verification email to ${userEmail}:`, err?.message ?? err);
            throw err;
        }
    }
}