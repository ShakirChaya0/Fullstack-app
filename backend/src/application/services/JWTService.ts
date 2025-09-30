import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtPayloadInterface } from '../../domain/interfaces/JwtPayloadInterface.js';
import { UnauthorizedError } from '../../shared/exceptions/UnauthorizedError.js';

export class JWTService {
    constructor(
        private readonly accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "",
        private readonly refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "",
        private readonly resetPasswordTokenSecret: string = process.env.RESET_PASSWORD_TOKEN_SECRET || "",
        private readonly confirmEmailTokenSecret: string = process.env.CONFIRM_EMAIL_TOKEN_SECRET || ""
    ) {}

    public generateAccessToken(payload: JwtPayloadInterface): string {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn: "3m" }); // <-- VOLVER A LA DURACIÓN 10m
    }

    public verifyAccessToken(token: string): JwtPayloadInterface {
        return jwt.verify(token, this.accessTokenSecret) as JwtPayloadInterface;
    }
    
    public generateRefreshToken(payload: JwtPayloadInterface): string {
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: "8d" });
    }

    public verifyRefreshToken(token: string): JwtPayloadInterface {
        return jwt.verify(token, this.refreshTokenSecret) as JwtPayloadInterface;
    }

    public generateResetPasswordToken(payload: { userId: string }): string {
        return jwt.sign(payload, this.resetPasswordTokenSecret, { expiresIn: "10m" });
    }

    public verifyResetPasswordToken(token: string): { userId: string } {
        return jwt.verify(token, this.resetPasswordTokenSecret) as { userId: string };
    }

    public generateConfirmEmailToken(payload: { userId: string }): string {
        return jwt.sign(payload, this.confirmEmailTokenSecret, { expiresIn: "1h" });
    }

    public verifyConfirmEmailToken(token: string): { userId: string } {
        return jwt.verify(token, this.confirmEmailTokenSecret) as { userId: string };
    }

    public decodeExpiredEmailToken(token: string): { userId: string } {
        const decoded = jwt.decode(token);

        if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
            throw new UnauthorizedError("Token inválido o sin id");
        }
    
        return { userId: (decoded as JwtPayload).userId as string };
    }
}