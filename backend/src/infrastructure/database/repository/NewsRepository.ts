import prisma from "../prisma/PrismaClientConnection.js"
import { INewsRepository } from "../../../domain/repositories/INewsRepository.js";
import { NewsClass } from "../../../domain/entities/News.js";
import { PartialNews } from "../../../domain/interfaces/NewsInterface.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { SchemaNews } from "../../../shared/validators/NewsZod.js";

export class NewsRepository implements INewsRepository{
    async register (data: SchemaNews): Promise<NewsClass>{
        try{
            const novedad = await prisma.novedad.create({
                data: {
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    fechaInicio: new Date(data.fechaInicio),
                    fechaFin: new Date(data.fechaFin)
                }
            })
            return new NewsClass(novedad.idNovedad, novedad.titulo, novedad.descripcion, novedad.fechaInicio, novedad.fechaFin)
        }
        catch(error: any){
            if (error?.code === 'P2002' && error?.meta?.target?.includes('titulo')) {
                throw new ConflictError("Ya existe una novedad con ese título")
            }
            else {
                throw new ServiceError("Error al registrar la novedad en la base de datos")
            }
        }
    }

    async modify (id: number, data: PartialNews): Promise<NewsClass> {
        try {
            const novedad = await prisma.novedad.update({
                where: {
                    idNovedad: id
                },
                data: {
                    ...data
                }
            })
            return new NewsClass(novedad.idNovedad, novedad.titulo, novedad.descripcion, novedad.fechaInicio, novedad.fechaFin)
        }
        catch (error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('titulo')) {
                throw new ConflictError("Ya existe una novedad con ese título")
            }
            else {
                throw new ServiceError("Error al registrar la novedad en la base de datos")
            }
        }
    }

    async getOne (id: number): Promise<NewsClass | null> {
        try {
            const novedad = await prisma.novedad.findUnique({
                where: {idNovedad: id}
            })
            if (!novedad) return null
    
            return new NewsClass(novedad.idNovedad, novedad.titulo, novedad.descripcion, novedad.fechaInicio, novedad.fechaFin)
        }
        catch (error) {
            throw new ServiceError("Error al registrar la novedad en la base de datos")
        }
    }

    async getAll (): Promise<NewsClass[]>{
        try {
            const news = await prisma.novedad.findMany()
            return news.map((n) => {
                return new NewsClass(n.idNovedad, n.titulo, n.descripcion, n.fechaInicio, n.fechaFin)
            })
        }
        catch (error) {
            throw new ServiceError("Error al registrar la novedad en la base de datos")
        }
    }

    async delete (id: number): Promise<void>{
        try {
            await prisma.novedad.delete({
                where: {idNovedad: id}
            })
            return
        }
        catch (error) {
            throw new ServiceError("Error al registrar la novedad en la base de datos")
        }
    }

    async getActive (): Promise<NewsClass[]>{
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const news = await prisma.novedad.findMany({
                where: {
                    fechaInicio: {
                        gte: hoy
                    },
                    fechaFin: {
                        lte: hoy
                    }
                }
            });

            return news.map((n) => {
                return new NewsClass(n.idNovedad, n.titulo, n.descripcion, n.fechaInicio, n.fechaFin)
            })
        }
        catch (error) {
            throw new ServiceError("Error al registrar la novedad en la base de datos")
        }
    }
}