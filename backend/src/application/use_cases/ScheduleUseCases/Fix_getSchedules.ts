import { Schedule } from "../../../domain/entities/Schedule.js";
import { ScheduleRepositoy } from "../../../infrastructure/database/repository/Fix_scheduleRepositoy.js";


export class GetSchedules {
    constructor (
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(): Promise<Schedule[]> {
        return await this.scheduleRepository.getAll();
    }
}
