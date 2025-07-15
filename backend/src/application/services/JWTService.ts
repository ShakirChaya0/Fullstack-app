import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtPayloadInterface } from '../../domain/interfaces/jwtPayloadInterface.js';
dotenv.config();

export class JWTService {
    constructor(
        private readonly accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "",
        private readonly refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || ""
    ) {}
    async generateAccessToken(payload: JwtPayloadInterface): Promise<string> {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn: "3m" });
    }

    async verifyAccessToken(token: string): Promise<JwtPayloadInterface> {
        return jwt.verify(token, this.accessTokenSecret) as Promise<JwtPayloadInterface>;
    }
    
    async generateRefreshToken(payload: JwtPayloadInterface): Promise<string> {
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: "15m" });
    }

    async verifyRefreshToken(token: string): Promise<JwtPayloadInterface> {
        return jwt.verify(token, this.refreshTokenSecret) as Promise<JwtPayloadInterface>;
    }
}