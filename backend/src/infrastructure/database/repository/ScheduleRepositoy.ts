import prisma from "../prisma/PrismaClientConnection.js"
import { IScheduleRepository } from "../../../domain/repositories/IScheduleRepository.js";
import { Schedule } from "../../../domain/entities/Schedule.js";
import { SchemaSchedule } from "../../../shared/validators/ScheduleZod.js";
import { IUpdateSchedule } from "../../../domain/interfaces/Schedule.interface.js";

export class ScheduleRepositoy implements IScheduleRepository{

    public async getAll(): Promise<Schedule[]> {
        const horarios = await prisma.horarios.findMany();
        return horarios.map(horario => new Schedule(
            horario.diaSemana,        
            horario.horaApertura.toISOString().slice(11, 16),
            horario.horaCierre.toISOString().slice(11, 16)
        ))
    }

    public async getById(diaSemana: number): Promise<Schedule | null> {
        const horario = await prisma.horarios.findUnique({
            where: { diaSemana: diaSemana}
        })
        
        if (!horario) return null;

        return new Schedule(
            horario.diaSemana,
            horario.horaApertura.toISOString().slice(11, 16),
            horario.horaCierre.toISOString().slice(11, 16)
        );
    }

    public async create(horario: SchemaSchedule): Promise<Schedule> {
        const [openHours, openMinutes] = horario.horaApertura.split(':').map(Number)
        const [closeHours, closeMinutes] = horario.horaCierre.split(':').map(Number)

        const nuevoHorario = await prisma.horarios.create({
            data: {
                diaSemana: horario.diaSemana,
                //Se establece fechas fijas para los horarios ya que en la BD se guardaran como datos Time without zone time
                //pero prisma exige que sean del tipo Date aunque solo use la hora
                horaApertura: new Date(Date.UTC(1970, 0, 1, openHours, openMinutes, 0, 0)),
                horaCierre: new Date(Date.UTC(1970, 0, 1, closeHours, closeMinutes, 0, 0))
            }
        })

        return new Schedule(
            nuevoHorario.diaSemana,
            nuevoHorario.horaApertura.toISOString().slice(11, 16),
            nuevoHorario.horaCierre.toISOString().slice(11, 16)
        );
    }
    
    public async update(diaSemana: number, horarioApertura: string | undefined, horarioCierre: string | undefined): Promise<Schedule>{
        //Como se desean guardar los horarios como variables del tipo Time y debido a que prisma requiere que estas mismas variables sean
        //del tipo Date se implementa una interfaz provisoria para ejecutar el update
        const camposQueActualizar: IUpdateSchedule = {} 

        if (horarioApertura){
            const [openHours, openMinutes] = horarioApertura.split(':').map(Number)
            camposQueActualizar.horaApertura = new Date(Date.UTC(1970, 0, 1, openHours, openMinutes, 0, 0))
        }

        if (horarioCierre){
            const [closeHours, closeMinutes] = horarioCierre.split(':').map(Number)
            camposQueActualizar.horaCierre = new Date(Date.UTC(1970, 0, 1, closeHours, closeMinutes, 0, 0))
        }
        
        const horarioActualizado = await prisma.horarios.update({
            where: {diaSemana: diaSemana},
            data: {
                ...camposQueActualizar
            }
        })
        return new Schedule(
            horarioActualizado.diaSemana,
            horarioActualizado.horaApertura.toISOString().slice(11, 16),
            horarioActualizado.horaCierre.toISOString().slice(11, 16)
        );
    }
}
