import { Schedule } from "../../../domain/entities/Schedule.js";
import { ScheduleRepositoy } from "../../../infrastructure/database/repository/ScheduleRepositoy.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { SchemaSchedule } from "../../../shared/validators/ScheduleZod.js";

export class CUU13RegisterSchedule {
    constructor(
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(horario: SchemaSchedule): Promise<Schedule> {
        const validarExistencia = await this.scheduleRepository.getById(horario.diaSemana);

        if (validarExistencia !== null) throw new ConflictError('El día ' + horario.diaSemana + ' ya se encuentra registrado');

        const horarioBD = await this.scheduleRepository.create(horario);
        return horarioBD
    }
}