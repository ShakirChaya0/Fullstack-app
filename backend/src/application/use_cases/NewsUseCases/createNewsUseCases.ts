import { NewsClass } from "../../../domain/entities/News.js";
import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";
import { ValidateNews } from "../../../presentation/validators/newsZod.js";

export class CreateNewsUseCases {
    constructor(
        private newsRepo = new NewsRepository()
    ){}
    
    async execute(data: any){
        const dataValidated = ValidateNews(data)
        console.log(data, dataValidated.error)
        if(!dataValidated.success) throw new Error(`${dataValidated.error}`)
        const newData = new NewsClass(0, dataValidated.data.titulo, dataValidated.data.descripcion, dataValidated.data.fechaInicio, dataValidated.data.fechaFin)
        const news = await this.newsRepo.register(newData)
        return news
    }
}