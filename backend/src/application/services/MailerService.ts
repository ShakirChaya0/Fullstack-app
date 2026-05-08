import axios from 'axios';
import { getResetPasswordTemplate, getVerificationTemplate } from "../../shared/constants/mailTemplates.js";

export class MailerService {
    private apiKey: string;
    private senderEmail: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.BREVO_API_KEY!;
        // Usar un email REAL verificado, no el usuario SMTP
        this.senderEmail = process.env.EMAIL_USER!;

        // this.baseUrl = process.env.FRONTEND_URL!;
        this.baseUrl = "http://localhost:5173";

        if (!this.apiKey || !this.senderEmail) {
            throw new Error("BREVO_API_KEY o EMAIL_FROM no están configuradas");
        }
    }

    public async sendResetPasswordEmail(userEmail: string, token: string) {
        const resetLink = `${this.baseUrl}/reset-password?token=${token}`;
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
            return response.data;
        } catch (error: any) {
            console.error('[MailerService] Error al enviar email:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
            throw error;
        }
    }

    public async sendVerificationEmail(userEmail: string, token: string) {
        const verifyUrl = `${this.baseUrl}/verify-email?token=${token}`;
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
            return response.data;
        } catch (error: any) {
            console.error('[MailerService] Error al enviar email:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
            throw error;
        }
    }
}