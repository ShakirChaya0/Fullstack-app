import prisma from "../prisma/PrismaClientConnection.js"
import { INewsRepository } from "../../../domain/repositories/INewsRepository.js";
import { NewsClass } from "../../../domain/entities/News.js";
import { PartialNews } from "../../../domain/interfaces/NewsInterface.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { SchemaNews } from "../../../shared/validators/NewsZod.js";
import { Prisma } from "@prisma/client";

const limit = 5
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

export class NewsRepository implements INewsRepository{
    async register (data: SchemaNews): Promise<NewsClass>{
        try{
            const novedad = await prisma.novedad.create({
                data: {
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    fechaInicio: data.fechaInicio,
                    fechaFin: data.fechaFin
                }
            })
            return new NewsClass(novedad.idNovedad, novedad.titulo, novedad.descripcion, novedad.fechaInicio, novedad.fechaFin)
        }
        catch(error: any){
            if (error?.code === 'P2002' && error?.meta?.target?.includes('titulo')) {
                throw new ConflictError("Ya existe una novedad con ese título")
            }
            else {
                throw new ServiceError(`Error al registrar la novedad en la base de datos: ${error}`)
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
        const news = await prisma.novedad.findUnique({
            where: { idNovedad: id}
        })
        
        if(!news) return null

        return new NewsClass(news.idNovedad, news.titulo, news.descripcion, news.fechaInicio, news.fechaFin)
    }

    async getByTitle (title: string, page: number, status: any): Promise<{News: NewsClass[], pages: number, totalItems: number}> {
        try {
            const whereClause = status === "Activas" ? {
                titulo: {
                        contains: title,
                        mode: Prisma.QueryMode.insensitive
                },
                fechaInicio: {
                    lte: hoy
                },
                fechaFin: {
                    gte: hoy
                }
            } : {
                titulo: {
                        contains: title,
                        mode: Prisma.QueryMode.insensitive
                    }
                }

            const skip = (page - 1) * limit
            
            const novedad = await prisma.novedad.findMany({
                skip: skip,
                take: limit,
                where: whereClause,
                orderBy: { idNovedad: "desc"}
            })

            const totalItems = await prisma.novedad.count({
                where: whereClause
            })
            
            const totalPages = Math.ceil(totalItems / limit)

            return {News: novedad.map((n) => {
                return new NewsClass(n.idNovedad, n.titulo, n.descripcion, n.fechaInicio, n.fechaFin)
            }), pages: totalPages, totalItems: totalItems}
        }
        catch (error) {
            throw new ServiceError("Error al registrar la novedad en la base de datos")
        }
    }

    async getAll (page: number, status: any): Promise<{News: NewsClass[], pages: number, totalItems: number}>{
        try {
            const whereClause = status === "Activas" ? {
                fechaInicio: {
                    lte: hoy
                },
                fechaFin: {
                    gte: hoy
                }
            } : {}

            const skip = (page - 1) * limit
            const news = await prisma.novedad.findMany({
                skip: skip,
                take: limit,
                orderBy: { idNovedad: "desc" },
                where: whereClause
            })
            const totalItems = await prisma.novedad.count({
                where: whereClause
            })
            const totalPages = Math.ceil(totalItems / limit)
            return {News: news.map((n) => {
                return new NewsClass(n.idNovedad, n.titulo, n.descripcion, n.fechaInicio, n.fechaFin)
            }), pages: totalPages, totalItems: totalItems}
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
}