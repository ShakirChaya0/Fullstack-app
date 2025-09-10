import { createTransport } from "nodemailer";

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
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        const mailBody = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

                    <h2 style="color: #2c3e50; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Solicitud de Restablecimiento de Contraseña</h2>

                    <p style="font-size: 16px; line-height: 1.6;">Hola,</p>

                    <p style="font-size: 16px; line-height: 1.6;">Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Para establecer una nueva contraseña, haz clic en el botón de abajo.</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #e17100; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Restablecer Contraseña</a>
                    </div>

                    <p style="font-size: 16px; line-height: 1.6;">Este enlace expirará en <strong>15 minutos</strong>.</p>

                    <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">Si no solicitaste un restablecimiento de contraseña, ignora este correo.</p>

                    <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">Gracias,<br>El equipo de Soporte Restaurante</p>

                </div>
                <div style="text-align: center; padding: 20px; font-size: 12px; color: #999999;">
                    <p>&copy; 2025 Nombre del Restaurante. Todos los derechos reservados.</p>
                </div>
            </div>
        `;

        await this.transporter.sendMail({
            from: '"Soporte Restaurante" <no-reply@tudominio.com>',
            to: userEmail,
            subject: "Restablece tu contraseña",
            html: mailBody,
        });
    }
}
