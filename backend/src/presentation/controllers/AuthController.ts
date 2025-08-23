import { NextFunction, Request, Response } from "express";
import { LoginUseCase } from "../../application/use_cases/AuthUseCases/LogInUseCase.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { RefreshUseCase } from "../../application/use_cases/AuthUseCases/RefreshUseCase.js";
import { LogOutUseCase } from "../../application/use_cases/AuthUseCases/LogOutUseCase.js";
import { ValidateAuth } from "../../shared/validators/AuthZod.js";

export class AuthController {
    constructor(
        private readonly loginUC = new LoginUseCase(),
        private readonly refreshUC = new RefreshUseCase(),
        private readonly logOutUC = new LogOutUseCase()
    ) {}
    async login(req: Request, res: Response, next: NextFunction) {
        try{
            const { email, password } = req.body;
            if (!email || !password) throw new ValidationError("No se ingresaron todos los campos obligatorios");

            const validation = ValidateAuth({ email, password });
            if (!validation.success) throw new ValidationError(`Validation failed: ${validation.error.message}`);
            
            const result = await this.loginUC.execute(email, password);

            res
                .cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 15 })
                .status(200).json({ token: result.accessToken });
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
}