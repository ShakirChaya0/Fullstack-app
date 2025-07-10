import { Request, Response } from "express";
import { GetSchedules } from "../../application/use_cases/ScheduleUseCases/getSchedules.js";
import { GetScheduleById } from "../../application/use_cases/ScheduleUseCases/getScheduleById.js";
import { CUU13RegisterSchedule } from "../../application/use_cases/ScheduleUseCases/CUU13RegisterSchedule.js";
import { CUU14ModifySchedule } from "../../application/use_cases/ScheduleUseCases/CUU14ModifySchedule.js";
import { ValidatePartialSchedule , PartialSchemaSchedule} from "../../shared/validators/scheduleZod.js";


export class HorarioController {
    constructor(
        private readonly cUU13RegisterSchedule = new CUU13RegisterSchedule(),
        private readonly cUU14ModifySchedule = new CUU14ModifySchedule(),
        private readonly getScheduleById = new GetScheduleById(),
        private readonly getSchedules = new GetSchedules()
    ) {}

    public getAll = async (req:Request, res:Response) =>{
        try{
            const horarios = await this.getSchedules.execute();
            if (!horarios || horarios.length === 0) {
                res.status(404).json({ error: "Horario no encontrado" });
                return;
            }
            res.status(200).json(horarios);
        }catch(error:any){
            console.log("Error al obtener los horarios ", error);
            res.status(500).json({ error: error.message })
        }
    }

    public getById = async (req: Request, res:Response) =>{
        try {
            const idHorario = req.params.idHorario;
            
            if (!idHorario || isNaN(+idHorario)) {
                throw new Error("ID debe ser un número");
            }

            const horario = await this.getScheduleById.execute(+idHorario);

            if (!horario){
                res.status(404).json({ error: "Horario no encontrado" });
                return;
            }

            res.status(200).json(horario);

        }catch(error){
            console.log("Error al obtener el horario ", error);
            res.status(500);
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const { diaSemana , horaApertura, horaCierre}  = req.body;

            if (!diaSemana || !horaApertura || !horaCierre) {
                res.status(400).json({ error: "Todos los campos deben ser completados" });
                return;
            }

            const horario = await this.cUU13RegisterSchedule.execute(req.body);

            res.status(201).json(horario);
        } catch (error: any) {
            console.log("Error al crear el horario: ", error);
            res.status(500).json({ error: error.message });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const diaSemana = req.params.idHorario;
            if (!diaSemana || isNaN(+diaSemana)) {
                throw new Error("ID debe ser un número");
            }

            const validarHorario = ValidatePartialSchedule(req.body);
            if(!validarHorario.success) throw new Error(`Validación fallida: ${validarHorario.error.message}`);

            const horarioParcial: PartialSchemaSchedule = validarHorario.data;

            const horario = await this.cUU14ModifySchedule.execute(+diaSemana, horarioParcial);

            // if(!horario){
            //     res.status(404).json({error: "Horario no encontrado"})
            // }
            res.status(200).json(horario);
        } catch (error: any) {
            res.status(500).json({error: error.message});
        }
    }
}
