import { NewsRepository } from "../../../infrastructure/database/repository/NewsRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class DeleteNewsUseCase {
    constructor(
        private readonly newsRepository = new NewsRepository()
    ){}
    
    async execute (id: number): Promise<void>{
        const exists = this.newsRepository.getOne(id)
        if(!exists) throw new NotFoundError("No se encontro la novedad a eliminar")
        
        return this.newsRepository.delete(id)
    }
}