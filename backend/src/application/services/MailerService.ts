import axios from 'axios';
import { getResetPasswordTemplate, getVerificationTemplate } from "../../shared/constants/mailTemplates.js";

export class MailerService {
    private apiKey: string;
    private senderEmail: string;

    constructor() {
        this.apiKey = process.env.BREVO_API_KEY!;
        this.senderEmail = process.env.BREVO_SMTP_USER!;

        if (!this.apiKey || !this.senderEmail) {
            throw new Error("BREVO_API_KEY o BREVO_SMTP_USER no están configuradas");
        }

        console.log("[MailerService] ✅ Inicializado con Brevo API");
    }

    public async sendResetPasswordEmail(userEmail: string, token: string) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const mailBody = getResetPasswordTemplate(resetLink);

        try {
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    to: [{ email: userEmail }],
                    sender: {
                        email: this.senderEmail,
                        name: 'Soporte Restaurante'
                    },
                    subject: 'Restablece tu contraseña',
                    htmlContent: mailBody,
                },
                {
                    headers: {
                        'api-key': this.apiKey,
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("[MailerService] ✅ Reset email enviado a:", userEmail, "| ID:", response.data.messageId);
            return response.data;
        } catch (error: any) {
            console.error("[MailerService] ❌ Error enviando reset email a", userEmail, ":", error.message);
            throw error;
        }
    }

    public async sendVerificationEmail(userEmail: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const emailBody = getVerificationTemplate(verifyUrl);

        try {
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    to: [{ email: userEmail }],
                    sender: {
                        email: this.senderEmail,
                        name: 'Soporte Restaurante'
                    },
                    subject: 'Verifica tu dirección de correo electrónico',
                    htmlContent: emailBody,
                },
                {
                    headers: {
                        'api-key': this.apiKey,
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("[MailerService] ✅ Verification email enviado a:", userEmail, "| ID:", response.data.messageId);
            return response.data;
        } catch (error: any) {
            console.error("[MailerService] ❌ Error enviando verification email a", userEmail, ":", error.message);
            throw error;
        }
    }
}