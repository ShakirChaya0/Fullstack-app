import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js"
import { PartialSchemaNews } from "../../../shared/validators/newsZod.js"

export class ModifyNewsUseCases {
    constructor(
        private newsRepo = new NewsRepository()
    ){}
    
    execute(id: number,data: PartialSchemaNews){
        const news = this.newsRepo.modify(id, data)
        return news
    }
}