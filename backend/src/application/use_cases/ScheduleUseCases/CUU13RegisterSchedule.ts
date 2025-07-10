import { Schedule } from "../../../domain/entities/Schedule.js";
import { ScheduleRepositoy } from "../../../infrastructure/database/repository/scheduleRepositoy.js";
import { diaDentroSemana, SchemaSchedule } from "../../../shared/validators/scheduleZod.js";


export class CUU13RegisterSchedule {
    constructor(
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(horario: SchemaSchedule): Promise<Schedule> {
        const validarExistencia = await this.scheduleRepository.getById(horario.diaSemana);

        if(validarExistencia !== null) throw new Error ('El día ' + horario.diaSemana + ' ya se encuentra registrado');

        //Validación no aplicable ya que todas las entradas de horarios son validas
        // const validarHorario = horarioCorrecto.safeParse(horario);
        // if (!validarHorario.success) {
        //     throw new Error('El horario de Apertura debe ser menor que el horario de Cierre');
        // }

        const validarDia = diaDentroSemana(horario.diaSemana);

        if(validarDia === false) throw new Error('Día a crear fuera de la semana [1-7]');

        const horarioBD = await this.scheduleRepository.create(horario);
        return horarioBD
    }
}