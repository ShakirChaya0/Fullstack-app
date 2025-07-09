import { PrismaClient } from "@prisma/client";
import { IScheduleRepository } from "../../../domain/repositories/IScheduleRepository.js";
import { Schedule } from "../../../domain/entities/Schedule.js";


const prisma = new PrismaClient();

export class ScheduleRepositoy implements IScheduleRepository{

    public async getAll(): Promise<Schedule[]> {
        const horarios = await prisma.horarios.findMany();
        return horarios.map(horario => new Schedule(
            horario.diaSemana,
            horario.horaApertura,
            horario.horaCierre
        ))
        
    }

    public async getById(idHorario: number): Promise<Schedule | null> {
        const horario = await prisma.horarios.findUnique({
            where: { diaSemana: idHorario}
        })
        
        if (!horario) {
            return null;
        }

        return new Schedule(
            horario.diaSemana,
            horario.horaApertura,
            horario.horaCierre
        );
    }

    // public async create(horario: SchemaSchedule): Promise<Schedule> {

    //     return
    // }

    // public async update(horario: PartialSchemaSchedule, idHorario: number): Promise<Schedule>{

    //     return
    // }
}
