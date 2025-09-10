import jwt from 'jsonwebtoken';
import { JwtPayloadInterface } from '../../domain/interfaces/JwtPayloadInterface.js';

export class JWTService {
    constructor(
        private readonly accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "",
        private readonly refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "",
        private readonly resetPasswordTokenSecret: string = process.env.RESET_PASSWORD_TOKEN_SECRET || ""
    ) {}

    public generateAccessToken(payload: JwtPayloadInterface): string {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn: "7d" }); // <-- VOLVER A LA DURACIÓN 10m
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
}