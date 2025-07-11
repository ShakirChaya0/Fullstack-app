import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";


export class GetActiveNewsUseCase {
    constructor(
        private readonly newsRepository = new NewsRepository()
    ){}
    async execute (): Promise<NewsClass[]> {
        return await this.newsRepository.getActive()
    }
}