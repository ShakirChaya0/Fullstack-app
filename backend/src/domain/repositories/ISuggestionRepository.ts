import { Suggestion } from "../entities/Suggestion.js";
import { PartialSchemaSuggestion } from "../../shared/validators/SuggestionZod.js";

export interface ISuggestionRepository {
    getAll(): Promise<Suggestion[]>;

    getActiveSuggestions(): Promise<Suggestion[]>;

    findByProductAndDate(productId: number, dateFrom: Date): Promise<Suggestion | null>

    create(productId: number, dateFrom: Date, dateTo: Date): Promise<Suggestion>;

    update(data: PartialSchemaSuggestion, idProducto: number, fechaDesde: Date): Promise<Suggestion>;
}
