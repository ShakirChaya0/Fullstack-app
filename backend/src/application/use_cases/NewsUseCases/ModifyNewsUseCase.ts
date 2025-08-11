import { NewsClass } from "../../../domain/entities/News.js"
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js"
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js"
import { PartialSchemaNews } from "../../../shared/validators/NewsZod.js"

export class ModifyNewsUseCases {
    constructor(
        private newsRepo = new NewsRepository()
    ){}
    
    async execute(id: number,data: PartialSchemaNews): Promise<NewsClass>{
        const novedad = await this.newsRepo.getOne(id)
        if(!novedad) throw new NotFoundError("No se pudo encontrar la novedad ingresada")

        const validNews = {
            idNovedad: novedad.newsId,
            titulo: novedad.title,
            descripcion: novedad.description,
            fechaInicio: novedad.startDate,
            fechaFin: novedad.endDate,
            ...data
        }
        NewsClass.prototype.validar(validNews.fechaInicio, validNews.fechaFin)
        
        const news = await this.newsRepo.modify(id, data)
        return news
    }
}