import { createTransport } from "nodemailer";
import { getResetPasswordTemplate, getVerificationTemplate } from "../../shared/constants/mailTemplates.js";

export class MailerService {
    private readonly transporter;

    constructor() {
        // Validar que las variables existan
        if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
            throw new Error("BREVO_SMTP_USER o BREVO_SMTP_PASS no están configuradas");
        }

        this.transporter = createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS,
            },
        });

        console.log("[MailerService] ✅ Inicializado con Brevo SMTP");
    }

    public async sendResetPasswordEmail(userEmail: string, token: string) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const mailBody = getResetPasswordTemplate(resetLink);

        try {
            const info = await this.transporter.sendMail({
                from: `"Soporte Restaurante" <noreply@saboresdeluxe.com>`,
                to: userEmail,
                subject: "Restablece tu contraseña",
                html: mailBody,
            });

            console.log("[MailerService] ✅ Reset email enviado a:", userEmail, "| ID:", info.messageId);
            return info;
        } catch (error: any) {
            console.error("[MailerService] ❌ Error enviando reset email a", userEmail, ":", error.message);
            throw error;
        }
    }

    public async sendVerificationEmail(userEmail: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const emailBody = getVerificationTemplate(verifyUrl);

        try {
            const info = await this.transporter.sendMail({
                from: `"Soporte Restaurante" <noreply@saboresdeluxe.com>`,
                to: userEmail,
                subject: "Verifica tu dirección de correo electrónico",
                html: emailBody,
            });

            console.log("[MailerService] ✅ Verification email enviado a:", userEmail, "| ID:", info.messageId);
            return info;
        } catch (error: any) {
            console.error("[MailerService] ❌ Error enviando verification email a", userEmail, ":", error.message);
            throw error;
        }
    }
}