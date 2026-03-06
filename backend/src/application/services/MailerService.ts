import { Resend } from 'resend';
import { getResetPasswordTemplate, getVerificationTemplate } from "../../shared/constants/mailTemplates.js";

export class MailerService {
    private readonly resend: Resend;
    private readonly fromEmail: string;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = process.env.MAIL_FROM || "onboarding@resend.dev";

        if (!process.env.RESEND_API_KEY) {
            console.warn('[MailerService] RESEND_API_KEY is not set. Email sending will fail.');
        } else {
            console.info('[MailerService] Resend service initialized.');
        }
    }

    public async sendResetPasswordEmail(userEmail: string, token: string) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const mailBody = getResetPasswordTemplate(resetLink);

        try {
            const { data, error } = await this.resend.emails.send({
                from: `Soporte Restaurante <${this.fromEmail}>`,
                to: [userEmail],
                subject: "Restablece tu contraseña",
                html: mailBody,
            });

            if (error) throw error;
            return data;
        } catch (err: any) {
            console.error(`[MailerService] Failed to send reset password email to ${userEmail}:`, err?.message ?? err);
            throw err;
        }
    }

    public async sendVerificationEmail(userEmail: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const emailBody = getVerificationTemplate(verifyUrl);

        try {
            const { data, error } = await this.resend.emails.send({
                from: `Soporte Restaurante <${this.fromEmail}>`,
                to: [userEmail],
                subject: "Verifica tu dirección de correo electrónico",
                html: emailBody,
            });

            if (error) throw error;
            return data;
        } catch (err: any) {
            console.error(`[MailerService] Failed to send verification email to ${userEmail}:`, err?.message ?? err);
            throw err;
        }
    }
}