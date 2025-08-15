import { Schedule } from "../../../domain/entities/Schedule.js";
import { ScheduleRepositoy } from "../../../infrastructure/database/repository/ScheduleRepositoy.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetScheduleById {
    constructor (
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(idHorario: number): Promise<Schedule> {
        const schedule =  await this.scheduleRepository.getById(idHorario);

        if (!schedule) throw new NotFoundError("Horario no encontrado");

        return schedule;
    }
}