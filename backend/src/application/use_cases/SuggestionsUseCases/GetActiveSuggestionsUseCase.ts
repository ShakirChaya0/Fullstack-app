import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";


export class GetActiveSuggestionsUseCase {
    constructor(
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(): Promise<Suggestion[]> {
        const suggestions = await this.suggestionRepository.getActiveSuggestions();
        return suggestions;
    }
}