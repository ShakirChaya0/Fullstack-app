import { Request, Response } from "express";
import { GetSchedules } from "../../application/use_cases/ScheduleUseCases/getSchedules.js";
import { GetScheduleById } from "../../application/use_cases/ScheduleUseCases/getScheduleById.js";

export class HorarioController {
    constructor(
        // private readonly CUU13RegisterSchedule = new CUU13RegisterSchedule(),
        // private readonly CUU14ModifySchedule = new CUU14ModifySchedule(),
        private readonly getScheduleById = new GetScheduleById(),
        private readonly getSchedules = new GetSchedules()
    ) {}

    public getAll = async (req:Request, res:Response) =>{
        try{
            const horarios = await this.getSchedules.execute();
            if (!horarios || horarios.length === 0) {
                res.status(404).json({ error: "No schedules found" });
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
                throw new Error("ID sent must be a number");
            }

            const horario = await this.getScheduleById.execute(+idHorario);

            if (!horario){
                res.status(404).json({ error: "Schedule not found" });
                return;
            }

            res.status(200).json(horario);

        }catch(error){
            console.log("Error al obtener el horario ", error);
            res.status(500);
        }
    }

    // public create = async (req: Request, res: Response) => {
        
    // }

    // public modify = async (req: Request, res: Response) => {
        
    // }
}
