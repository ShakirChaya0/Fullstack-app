import { createTransport } from "nodemailer";
import { getResetPasswordTemplate, getVerificationTemplate } from "./mailTemplates.js";

export class MailerService {
    constructor(
        private readonly transporter = createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
    ) {}

    public async sendResetPasswordEmail(userEmail: string, token: string) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
        const mailBody = getResetPasswordTemplate(resetLink);
    
        await this.transporter.sendMail({
            from: `"Soporte Restaurante" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Restablece tu contraseña",
            html: mailBody,
        });
    }

    public async sendVerificationEmail(userEmail: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const emailBody = getVerificationTemplate(verifyUrl);

        await this.transporter.sendMail({
            from: `"Soporte Restaurante" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Verifica tu dirección de correo electrónico",
            html: emailBody,
        });
    }
}