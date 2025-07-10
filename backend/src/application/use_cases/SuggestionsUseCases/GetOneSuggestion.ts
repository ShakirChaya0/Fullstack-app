import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";

export class GetOneSuggestionUseCase {
    constructor(
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(productId: number, dateFrom: Date): Promise<Suggestion | null> {
        const suggestion = await this.suggestionRepository.findByProductAndDate(productId, dateFrom);
        return suggestion;
    }
}