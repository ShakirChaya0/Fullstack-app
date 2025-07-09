import { Schedule } from "../entities/Schedule.js";
//import { SchemaSchedule, PartialSchemaSchedule } from "../../presentation/validators/scheduleZod.js";

export interface IScheduleRepository {
    getAll(): Promise<Schedule[]>

    getById(idHorario: number): Promise<Schedule | null>;

    // create(horario: SchemaSchedule): Promise<Schedule>;

    // update(horario: PartialSchemaSchedule, idHorario: number): Promise<Schedule>;
}