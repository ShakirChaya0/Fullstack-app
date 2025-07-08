import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js"
import { ValidateNewsPartial } from "../../../presentation/validators/newsZod.js"

export class ModifyNewsUseCases {
    constructor(
        private newsRepo = new NewsRepository()
    ){}
    
    execute(id: number,data: any){
        const dataValidated = ValidateNewsPartial(data)
        if(!dataValidated.success) throw new Error(`${dataValidated.error}`)
        const news = this.newsRepo.modify(id, dataValidated.data)
        return news
    }
}