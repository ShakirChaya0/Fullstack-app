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
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
        const mailBody = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    
                    <h2 style="color: #2c3e50; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Solicitud de Restablecimiento de Contraseña</h2>
    
                    <p style="font-size: 16px; line-height: 1.6;">Hola,</p>
    
                    <p style="font-size: 16px; line-height: 1.6;">Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Para establecer una nueva contraseña, haz clic en el botón de abajo.</p>
    
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                        <tr>
                            <td align="center" bgcolor="#e17100" style="border-radius: 5px;">
                                <a href="${resetLink}" target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 15px 25px; border: 1px solid #e17100; display: block;">Restablecer Contraseña</a>
                            </td>
                        </tr>
                    </table>
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
            from: `"Soporte Restaurante" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Restablece tu contraseña",
            html: mailBody,
        });
    }

    public async sendVerificationEmail(userEmail: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const emailBody = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

                    <h2 style="color: #2c3e50; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">¡Bienvenido/a! Confirma tu Correo</h2>

                    <p style="font-size: 16px; line-height: 1.6;">Hola,</p>

                    <p style="font-size: 16px; line-height: 1.6;">Gracias por registrarte en <strong>Soporte Restaurante</strong>. Para activar tu cuenta, por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo.</p>

                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                        <tr>
                            <td align="center" bgcolor="#28a745" style="border-radius: 5px;">
                                <a href="${verifyUrl}" target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 15px 25px; border: 1px solid #28a745; display: block;">Verificar Correo Electrónico</a>
                            </td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6;">La verificación de tu correo nos ayuda a mantener tu cuenta segura.</p>

                    <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
                    <a href="${verifyUrl}" style="color: #3498db; text-decoration: underline; word-break: break-all;">${verifyUrl}</a></p>

                    <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">Gracias,<br>El equipo de Soporte Restaurante</p>

                </div>
                <div style="text-align: center; padding: 20px; font-size: 12px; color: #999999;">
                    <p>&copy; 2025 Nombre del Restaurante. Todos los derechos reservados.</p>
                    <p>Has recibido este correo porque te has registrado en nuestro sitio web.</p>
                </div>
            </div>
        `;

        await this.transporter.sendMail({
            from: `"Soporte Restaurante" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Verifica tu dirección de correo electrónico",
            html: emailBody,
        });
    }
}
