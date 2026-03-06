import { createTransport } from "nodemailer";
import { getResetPasswordTemplate, getVerificationTemplate } from "../../shared/constants/mailTemplates.js";

export class MailerService {
    private readonly transporter;

    constructor() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("EMAIL_USER o EMAIL_PASS no están configuradas");
        }

        this.transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: true
            },

            connectionTimeout: 5000,
            socketTimeout: 10000,
        });

        this.verifyConnection();
    }

    private async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log("[MailerService] ✅ Conexión SMTP verificada correctamente");
        } catch (error) {
            console.error("[MailerService] ⚠️ Error verificando conexión SMTP:", error);
        }
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
            console.log("[MailerService] ✅ Reset email enviado a:", userEmail);
        } catch (error) {
            console.error("[MailerService] ❌ Error enviando reset email a", userEmail, ":", error);
            throw error;
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
            console.log("[MailerService] ✅ Verification email enviado a:", userEmail);
        } catch (error) {
            console.error("[MailerService] ❌ Error enviando verification email a", userEmail, ":", error);
            throw error;
        }
    }
}