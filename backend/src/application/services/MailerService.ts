import { createTransport } from "nodemailer";
import { getResetPasswordTemplate, getVerificationTemplate } from "../../shared/constants/mailTemplates.js";

export class MailerService {
    private readonly transporter;

    constructor() {
        this.transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
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
        } catch (error) {
            console.error("[MailerService] Error enviando reset email:", error);
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
        } catch (error) {
            console.error("[MailerService] Error enviando verification email:", error);
            throw error;
        }
    }
}