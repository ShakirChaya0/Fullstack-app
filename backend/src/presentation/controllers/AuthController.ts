import { NextFunction, Request, Response } from "express";
import { LoginUseCase } from "../../application/use_cases/AuthUseCases/LogInUseCase.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { RefreshUseCase } from "../../application/use_cases/AuthUseCases/RefreshUseCase.js";
import { LogOutUseCase } from "../../application/use_cases/AuthUseCases/LogOutUseCase.js";
import { ValidateAuth } from "../../shared/validators/AuthZod.js";
import { CheckClientStatusUseCase } from "../../application/use_cases/ClientUseCases/CheckClientStatusUseCase.js";
import { ForgotPasswordUseCase } from "../../application/use_cases/AuthUseCases/ForgotPasswordUseCase.js";
import { ResetPasswordUseCase } from "../../application/use_cases/AuthUseCases/ResetPasswordUseCase.js";
import { VerifyEmailUseCase } from "../../application/use_cases/AuthUseCases/VerifyEmailUseCase.js";
import { ResendEmailUseCase } from "../../application/use_cases/AuthUseCases/ResendEmailUseCase.js";

export class AuthController {
    constructor(
        private readonly loginUC = new LoginUseCase(),
        private readonly checkClientStatusUC = new CheckClientStatusUseCase(),
        private readonly refreshUC = new RefreshUseCase(),
        private readonly logOutUC = new LogOutUseCase(),
        private readonly forgotPasswordUC = new ForgotPasswordUseCase(),
        private readonly resetPasswordUC = new ResetPasswordUseCase(),
        private readonly verifyEmailUC = new VerifyEmailUseCase(),
        private readonly resendEmailUC = new ResendEmailUseCase()
    ) {}
    
    async login(req: Request, res: Response, next: NextFunction) {
        try{
            const { email, password } = req.body;
            if (!email || !password) throw new ValidationError("No se ingresaron todos los campos obligatorios");

            const validation = ValidateAuth({ email, password });
            if (!validation.success) throw new ValidationError(`Validation failed: ${validation.error.message}`);
            
            const { accessToken, refreshToken, user } = await this.loginUC.execute(email, password);

            if (user.userType === "Cliente") await this.checkClientStatusUC.execute(user.userId);

            res
                .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 15 })
                .status(200).json({ token: accessToken });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) throw new ValidationError("No se proporcionó un token de actualización");

            const result = await this.refreshUC.execute(token);

            res
                .cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 15 })
                .status(200).json({ token: result.accessToken});
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) throw new ValidationError("No se proporcionó un token a revocar");

            await this.logOutUC.execute(token);

            // Acordarse de que despues de que el front realice esta peticion, debe eliminar el token de acceso del contexto global

            res
                .clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' })
                .status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            if (!email) throw new ValidationError("No se ingresaron todos los campos obligatorios");

            await this.forgotPasswordUC.execute(email);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) throw new ValidationError("No se ingresaron todos los campos obligatorios");

            await this.resetPasswordUC.execute(token, newPassword);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            if (!token) throw new ValidationError("No se recibió el token de validación");

            await this.verifyEmailUC.execute(token);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async resendEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            if (!token) throw new ValidationError("No se recibió el token de validación");

            await this.resendEmailUC.execute(token);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}