import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";

export class GetByTitleNewsUseCase {
    constructor(
        private readonly newsRepository = new NewsRepository()
    ){}
    
    async execute(title: string, page: number, status: any): Promise<{News: NewsClass[], pages: number, totalItems: number}>{
        const news = await this.newsRepository.getByTitle(title, page, status)
        return news
    }
}