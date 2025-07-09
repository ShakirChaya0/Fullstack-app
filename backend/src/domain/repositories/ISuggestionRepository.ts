import { Suggestion } from "../entities/Suggestion.js";
import { SchemaSuggestion, PartialSchemaSuggestion } from "../../shared/validators/suggestionZod.js";

export interface ISuggestionRepository {
    getAll(): Promise<Suggestion[]>;

    getActiveSuggestions(): Promise<Suggestion[]>;

    create(data: SchemaSuggestion): Promise<Suggestion>;

    update(data: PartialSchemaSuggestion, idProducto: number, fechaDesde: Date): Promise<Suggestion>;
}
