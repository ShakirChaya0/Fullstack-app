import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";

export class GetSuggestionsUseCase {
    constructor(
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(): Promise<Suggestion[]> {
        return await this.suggestionRepository.getAll();
    }
}