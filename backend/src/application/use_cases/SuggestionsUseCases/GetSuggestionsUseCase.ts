import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";
import { SuggFilterOption, SuggSortOption } from "../../../shared/types/SharedTypes.js";

export class GetSuggestionsUseCase {
    constructor(
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(page: number, filter: SuggFilterOption, sorted: SuggSortOption): Promise<Suggestion[]> {
        return await this.suggestionRepository.getAll(page, filter, sorted);
    }
}