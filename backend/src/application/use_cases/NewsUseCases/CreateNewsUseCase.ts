import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";
import { SchemaNews } from "../../../shared/validators/Fix_newsZod.js";

export class CreateNewsUseCases {
    constructor(
        private newsRepo = new NewsRepository()
    ){}
    
    async execute(data: SchemaNews): Promise<NewsClass>{
        const newData = new NewsClass(0, data.titulo, data.descripcion, new Date(data.fechaInicio), new Date(data.fechaFin))
        const news = await this.newsRepo.register(newData)
        return news
    }
}