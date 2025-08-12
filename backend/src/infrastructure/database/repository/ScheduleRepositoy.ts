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
            horario.horaApertura.toTimeString().slice(0,5),
            horario.horaCierre.toTimeString().slice(0,5)
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
            horario.horaApertura.toTimeString().slice(0,5),
            horario.horaCierre.toTimeString().slice(0,5)
        );
    }

    public async create(horario: SchemaSchedule): Promise<Schedule> {
        const nuevoHorario = await prisma.horarios.create({
            data: {
                diaSemana: horario.diaSemana,
                //Se establece fechas fijas para los horarios ya que en la BD se guardaran como datos Time without zone time
                //pero prisma exige que sean del tipo Date aunque solo use la hora
                horaApertura: new Date(`1970-01-01T${horario.horaApertura}:00`),
                horaCierre: new Date(`1970-01-01T${horario.horaCierre}:00`)
            }
        });

        return new Schedule(
            nuevoHorario.diaSemana,
            nuevoHorario.horaApertura.toTimeString().slice(0,5),
            nuevoHorario.horaCierre.toTimeString().slice(0,5)
        );
    }

    public async update(diaSemana: number, horarioApertura: string | undefined, horarioCierre: string | undefined): Promise<Schedule>{
        //Como se desean guardar los horarios como variables del tipo Time y debido a que prisma requiere que estas mismas variables sean
        //del tipo Date se implementa una interfaz provisoria para ejecutar el update
        const camposQueActualizar: IUpdateSchedule = {} 

        if (horarioApertura){
            camposQueActualizar.horaApertura = new Date(`1970-01-01T${horarioApertura}:00`);
        }

        if (horarioCierre){
            camposQueActualizar.horaCierre = new Date(`1970-01-01T${horarioCierre}:00`)
        }
        
        const horarioActualizado = await prisma.horarios.update({
            where: {diaSemana: diaSemana},
            data: {
                ...camposQueActualizar
            }
        })
        return new Schedule(
            horarioActualizado.diaSemana,
            horarioActualizado.horaApertura.toTimeString().slice(0,5),
            horarioActualizado.horaCierre.toTimeString().slice(0,5)
        );
    }
}
