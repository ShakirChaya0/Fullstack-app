import { Suggestion } from "../entities/Suggestion.js";
import { PartialSchemaSuggestion } from "../../shared/validators/SuggestionZod.js";
import { SuggFilterOption, SuggSortOption } from "../../shared/types/SharedTypes.js";

export interface ISuggestionRepository {
    getAll(page: number, filter: SuggFilterOption, sorted: SuggSortOption): Promise<Suggestion[]>;

    findByProductAndDate(productId: number, dateFrom: Date): Promise<Suggestion | null>

    create(productId: number, dateFrom: Date, dateTo: Date): Promise<Suggestion>;

    update(data: PartialSchemaSuggestion, idProducto: number, fechaDesde: Date): Promise<Suggestion>;
}
