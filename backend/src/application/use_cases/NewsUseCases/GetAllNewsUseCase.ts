import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";

export class GetAllNewsUseCase {
    constructor(
        private readonly newsRepository = new NewsRepository()
    ){}
    
    async execute (): Promise<NewsClass[]> {
        return this.newsRepository.getAll()
    }
}