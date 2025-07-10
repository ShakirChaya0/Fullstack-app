import { Suggestion } from "../entities/Suggestion.js";
import { PartialSchemaSuggestion } from "../../shared/validators/suggestionZod.js";

export interface ISuggestionRepository {
    getAll(): Promise<Suggestion[]>;

    getActiveSuggestions(): Promise<Suggestion[]>;

    create(sugg: Suggestion): Promise<Suggestion>;

    update(data: PartialSchemaSuggestion, idProducto: number, fechaDesde: Date): Promise<Suggestion>;
}
