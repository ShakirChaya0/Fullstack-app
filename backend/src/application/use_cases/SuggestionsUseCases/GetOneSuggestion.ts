import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetOneSuggestionUseCase {
    constructor(
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(productId: number, dateFrom: Date): Promise<Suggestion> {
        const sugg = await this.suggestionRepository.findByProductAndDate(productId, dateFrom);

        if (!sugg) throw new NotFoundError("Sugerencia no encontrada");

        return sugg;
    }
}