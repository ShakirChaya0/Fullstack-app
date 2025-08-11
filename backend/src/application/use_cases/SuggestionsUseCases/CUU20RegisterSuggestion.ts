import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { SchemaSuggestion } from "../../../shared/validators/Fix_suggestionZod.js";

export class CUU20RegisterSuggestion {
    constructor(
        private readonly productRepository = new ProductRepository(),
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(data: SchemaSuggestion): Promise<Suggestion> {
        const product = await this.productRepository.getById(data.idProducto);

        if (!product) throw new NotFoundError("El ID ingresado no pertecene a un Producto");

        const newSuggestion = await this.suggestionRepository.create(new Suggestion(product, data.fechaDesde, data.fechaHasta));
        return newSuggestion;
    }
}