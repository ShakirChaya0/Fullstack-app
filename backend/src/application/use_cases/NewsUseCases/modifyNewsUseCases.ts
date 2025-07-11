import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js"
import { PartialSchemaNews } from "../../../shared/validators/newsZod.js"

export class ModifyNewsUseCases {
    constructor(
        private newsRepo = new NewsRepository()
    ){}
    
    execute(id: number,data: PartialSchemaNews){
        // Validar si existe la novedad con el ID ingresado
        // Validar si, en caso de que se modifique el título, no exista otra novedad con ese título
        // Validar que, en caso de que se modifique la fecha de inicio o fin, estas sean válidas
        const news = this.newsRepo.modify(id, data)
        return news
    }
}