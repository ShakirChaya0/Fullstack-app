import { Schedule } from "../entities/Schedule.js";
import { SchemaSchedule } from "../../shared/validators/scheduleZod.js";

export interface IScheduleRepository {
    getAll(): Promise<Schedule[]>

    getById(idHorario: number): Promise<Schedule | null>;

    create(horario: SchemaSchedule ): Promise<Schedule>;

    update(diaSemana: number, horarioApertura: string | undefined, horarioCierre: string | undefined): Promise<Schedule>;
}