import { ScheduleRepositoy } from "../../../infrastructure/database/repository/scheduleRepositoy.js";
import { PartialSchemaSchedule } from "../../../shared/validators/scheduleZod.js";
import { Schedule } from "../../../domain/entities/Schedule.js";

export class CUU14ModifySchedule {
    constructor(
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(diaSemana: number, horarioParcial: PartialSchemaSchedule): Promise<Schedule> {
        const validarExistencia = await this.scheduleRepository.getById(diaSemana);

        if(validarExistencia === null) throw new Error ('No se encontro un horario registrado para el día ' + diaSemana);

        //Validación no aplicable ya que se considera a todas las entradas de horarios como validas por sumar 24horas
        // const validarHorario = horarioCorrecto.safeParse(horario);
        // if (!validarHorario.success) {
        //     throw new Error('El horario de Apertura debe ser menor que el horario de Cierre');
        // }

        const horarioBD = await this.scheduleRepository.update(diaSemana, horarioParcial.horaApertura, horarioParcial.horaCierre);
        return horarioBD
    }
}