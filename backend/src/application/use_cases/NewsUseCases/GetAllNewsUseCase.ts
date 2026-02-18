import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";

export class GetAllNewsUseCase {
    constructor(
        private readonly newsRepository = new NewsRepository()
    ){}
    
    async execute (page: number, status: any): Promise<{News: NewsClass[], pages: number, totalItems: number}> {
        return this.newsRepository.getAll(page, status)
    }
}