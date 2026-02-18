import { NextFunction, Request, Response } from "express";
import { GetSchedules } from "../../application/use_cases/ScheduleUseCases/GetSchedules.js";
import { GetScheduleById } from "../../application/use_cases/ScheduleUseCases/GetScheduleById.js";
import { CUU13RegisterSchedule } from "../../application/use_cases/ScheduleUseCases/CUU13RegisterSchedule.js";
import { CUU14ModifySchedule } from "../../application/use_cases/ScheduleUseCases/CUU14ModifySchedule.js";
import { ValidatePartialSchedule , PartialSchemaSchedule, ValidateSchedule} from "../../shared/validators/ScheduleZod.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";

export class HorarioController {
    constructor(
        private readonly cUU13RegisterSchedule = new CUU13RegisterSchedule(),
        private readonly cUU14ModifySchedule = new CUU14ModifySchedule(),
        private readonly getScheduleById = new GetScheduleById(),
        private readonly getSchedules = new GetSchedules()
    ) {}

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const horarios = await this.getSchedules.execute();
            if (!horarios || horarios.length === 0) throw new NotFoundError("No hay horarios cargados");

            res.status(200).json(horarios);
        } catch(error) {
            next(error)
        }
    }

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const diaSemana = req.params.diaSemana;
            
            if (!diaSemana || isNaN(+diaSemana)) throw new ValidationError("El ID debe ser un número")

            const horario = await this.getScheduleById.execute(+diaSemana);

            res.status(200).json(horario);
        } catch(error) {
            next(error)
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { diaSemana , horaApertura, horaCierre}  = req.body;

            if ((!diaSemana && diaSemana != 0) || !horaApertura || !horaCierre) throw new ValidationError("Todos los campos son obligatorios")

            const validarHorario = ValidateSchedule(req.body);
            if (!validarHorario.success) throw new ValidationError(`Validation failed: ${validarHorario.error.message}`);

            const horario = await this.cUU13RegisterSchedule.execute(req.body);

            res.status(201).json(horario);
        } catch(error) {
            next(error)
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const diaSemana = req.params.diaSemana;
            if (!diaSemana || isNaN(+diaSemana)) throw new ValidationError("El día de la semana es obligatorio")

            const validarHorario = ValidatePartialSchedule(req.body);
            if (!validarHorario.success) throw new ValidationError(`Validation failed: ${validarHorario.error.message}`);
                
            const horarioParcial: PartialSchemaSchedule = validarHorario.data;

            const horario = await this.cUU14ModifySchedule.execute(+diaSemana, horarioParcial);

            res.status(200).json(horario);
        } catch(error) {
            next(error)
        }
    }
}
