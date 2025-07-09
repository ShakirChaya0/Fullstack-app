import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";


export class CUU20RegisterSuggestion {
    constructor(
        private readonly productRepository = new ProductRepository(),
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(): Promise<Suggestion[]> {

    }
}