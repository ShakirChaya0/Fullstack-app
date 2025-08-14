import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetOneNewsUseCase {
    constructor(
        private readonly newsRepository = new NewsRepository()
    ){}
    
    async execute(id: number): Promise<NewsClass>{
        const news = await this.newsRepository.getOne(id)
        if(!news) throw new NotFoundError("No se encontro la novedad buscada")
        return news
    }
}