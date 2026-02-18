import { ScheduleRepositoy } from "../../../infrastructure/database/repository/ScheduleRepositoy.js";
import { PartialSchemaSchedule } from "../../../shared/validators/ScheduleZod.js";
import { Schedule } from "../../../domain/entities/Schedule.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class CUU14ModifySchedule {
    constructor(
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(diaSemana: number, horarioParcial: PartialSchemaSchedule): Promise<Schedule> {
        const validarExistencia = await this.scheduleRepository.getById(diaSemana);

        if(validarExistencia === null) throw new NotFoundError('No se encontro un horario registrado para el día ' + diaSemana);

        const horarioBD = await this.scheduleRepository.update(diaSemana, horarioParcial.horaApertura, horarioParcial.horaCierre);
        return horarioBD
    }
}