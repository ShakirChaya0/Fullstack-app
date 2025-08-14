import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { SchemaNews } from "../../../shared/validators/NewsZod.js";

export class CreateNewsUseCases {
    constructor(
        private newsRepo = new NewsRepository()
    ){}
    
    async execute(data: SchemaNews): Promise<NewsClass>{
        const hoy = new Date();

        if (data.fechaInicio < hoy) throw new BusinessError("La fecha de inicio no puede ser anterior a la fecha actual");
        if (data.fechaFin < data.fechaInicio) throw new BusinessError("La fecha final no puede ser anterior a la fecha de inicio");    

        const news = await this.newsRepo.register(data)
        return news
    }
}