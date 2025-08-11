import { Schedule } from "../../../domain/entities/Schedule.js";
import { ScheduleRepositoy } from "../../../infrastructure/database/repository/Fix_scheduleRepositoy.js";


export class GetScheduleById {
    constructor (
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(idHorario: number): Promise<Schedule | null> {
        return await this.scheduleRepository.getById(idHorario);
    }
}