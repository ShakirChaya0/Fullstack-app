import { PrismaClient } from "@prisma/client";
import { INewsRepository } from "../../../domain/repositories/INewsRepository.js";
import { NewsClass } from "../../../domain/entities/News.js";
import { PartialNews } from "../../../domain/interfaces/newsInterface.js";

const prisma = new PrismaClient();

export class NewsRepository implements INewsRepository{
    async register (data: NewsClass): Promise<NewsClass>{
        try{
            const novedad = await prisma.novedades.create({
                data: {
                    titulo: data.title,
                    descripcion: data.description,
                    fechaInicio: new Date(data.startDate),
                    fechaFin: new Date(data.endDate)
                }
            })
            return new NewsClass(novedad.idNovedad, novedad.titulo, novedad.descripcion, novedad.fechaInicio, novedad.fechaFin)
        }
        catch(error: any){
            if (error?.code === 'P2002' && error?.meta?.target?.includes('titulo')) {
                throw new Error("Ya existe una novedad con ese título")
            }
            else{
                throw new Error(`Error al cargar la novedad`)
            }
        }
    }
    async modify (id: number, data: PartialNews): Promise<NewsClass> {
        const novedad = await prisma.novedades.update({
            where: {
                idNovedad: id
            },
            data: {
                ...data
            }
        })
        return new NewsClass(novedad.idNovedad, novedad.titulo, novedad.descripcion, novedad.fechaInicio, novedad.fechaFin)
    }
}