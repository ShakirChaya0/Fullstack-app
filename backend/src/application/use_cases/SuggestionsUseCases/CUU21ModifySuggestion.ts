import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { SuggestionRepository } from "../../../infrastructure/database/repository/SuggestionRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { PartialSchemaSuggestion } from "../../../shared/validators/SuggestionZod.js";

export class CUU21ModifySuggestion {
    constructor(
        private readonly productRepository = new ProductRepository(),
        private readonly suggestionRepository = new SuggestionRepository()
    ) {}

    public async execute(data: PartialSchemaSuggestion, idProducto: number, fechaDesde: Date): Promise<Suggestion> {
        const sugg = await this.suggestionRepository.findByProductAndDate(idProducto, fechaDesde);
        if (!sugg) throw new NotFoundError("No se encontró una sugerencia con el producto y fecha especificados");

        if (data.idProducto) {
            const product = await this.productRepository.getById(data.idProducto);
            if (!product) throw new NotFoundError("Producto no encontrado");
        }

        return await this.suggestionRepository.update(data, idProducto, fechaDesde);
    }
}