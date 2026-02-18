import { NewsClass } from "../../../domain/entities/News.js"
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js"
import { BusinessError } from "../../../shared/exceptions/BusinessError.js"
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js"
import { PartialSchemaNews } from "../../../shared/validators/NewsZod.js"

export class ModifyNewsUseCases {
    constructor(
        private newsRepository = new NewsRepository()
    ){}
    
    async execute(id: number, data: PartialSchemaNews): Promise<NewsClass>{
        const novedad = await this.newsRepository.getOne(id)
        if (!novedad) throw new NotFoundError("No se pudo encontrar la novedad ingresada")

        const today = new Date();

        const validNews = {
            idNovedad: novedad.newsId,
            titulo: novedad.title,
            descripcion: novedad.description,
            fechaInicio: novedad.startDate,
            fechaFin: novedad.endDate,
            ...data
        }

        if (validNews.fechaInicio < today) throw new BusinessError("La fecha de inicio no puede ser anterior a la fecha actual");
        if (validNews.fechaFin < validNews.fechaInicio) throw new BusinessError("La fecha final no puede ser anterior a la fecha de inicio");    
                
        const news = await this.newsRepository.modify(id, data)
        return news
    }
}