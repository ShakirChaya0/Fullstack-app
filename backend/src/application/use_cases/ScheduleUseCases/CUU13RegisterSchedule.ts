import { Schedule } from "../../../domain/entities/Schedule.js";
import { ScheduleRepositoy } from "../../../infrastructure/database/repository/Fix_scheduleRepositoy.js";
import { diaDentroSemana, SchemaSchedule } from "../../../shared/validators/Fix_scheduleZod.js";


export class CUU13RegisterSchedule {
    constructor(
        private readonly scheduleRepository = new ScheduleRepositoy()
    ) {}

    public async execute(horario: SchemaSchedule): Promise<Schedule> {

        const validarExistencia = await this.scheduleRepository.getById(horario.diaSemana);

        if(validarExistencia !== null) throw new Error ('El día ' + horario.diaSemana + ' ya se encuentra registrado');

        const validarDia = diaDentroSemana(horario.diaSemana);

        if(validarDia === false) throw new Error('Día a crear fuera de la semana [1-7]');

        const horarioBD = await this.scheduleRepository.create(horario);
        return horarioBD
    }
}