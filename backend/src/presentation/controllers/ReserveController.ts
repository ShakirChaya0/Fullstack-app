import {Request, Response,NextFunction} from "express"; 
import { CUU12RegisterAttendance } from "../../application/use_cases/ReserveUseCase/CUU12RegisterAttendanceUseCase.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";

export class ReserveController {
    constructor(
        private readonly cuu12RegisterAttendance = new CUU12RegisterAttendance
    ){}

    public async getReserveToday(req:Request, res:Response, next:NextFunction) {
        try {
            const today = req.params.fechaHoy as string;
            if(!today) {
                throw new ValidationError('La fecha ingresa es incorrecta')
            }
            const reserves = this.cuu12RegisterAttendance.execute(today)
        }
        catch (error) {
            next(error); 
        }
    }
}