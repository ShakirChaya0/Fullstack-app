import { Request, Response } from 'express';
import { CUU20RegisterSuggestion } from '../../application/use_cases/SuggestionsUseCases/CUU20RegisterSuggestion.js';
import { CUU21ModifySuggestion } from '../../application/use_cases/SuggestionsUseCases/CUU21ModifySuggestion.js';
import { GetActiveSuggestionsUseCase } from '../../application/use_cases/SuggestionsUseCases/GetActiveSuggestionsUseCase.js';
import { GetSuggestionsUseCase } from '../../application/use_cases/SuggestionsUseCases/GetSuggestionsUseCase.js';
import { GetOneSuggestionUseCase } from '../../application/use_cases/SuggestionsUseCases/GetOneSuggestion.js';
import { GetProductByIdUseCase } from '../../application/use_cases/ProductsUseCases/GetProductByIdUseCase.js';
import { ValidateSuggestion, ValidateSuggestionPartial } from '../../shared/validators/suggestionZod.js';

export class SuggestionsController {
    constructor(
        private readonly getProductByIdUseCase = new GetProductByIdUseCase(),
        private readonly getSuggestionsUseCase = new GetSuggestionsUseCase(),
        private readonly getActiveSuggestionsUseCase = new GetActiveSuggestionsUseCase(),
        private readonly registerSuggestionUseCase = new CUU20RegisterSuggestion(),
        private readonly getOneSuggestionUseCase = new GetOneSuggestionUseCase(),
        private readonly modifySuggestionUseCase = new CUU21ModifySuggestion()
    ) {}

    public async getAll(req: Request, res: Response) {
        try {
            const suggestions = await this.getSuggestionsUseCase.execute();
            res.json(suggestions);
        } 
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getActive(req: Request, res: Response) {
        try {
            const suggestions = await this.getActiveSuggestionsUseCase.execute();
            res.json(suggestions);
        } 
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async findProduct(req: Request, res: Response) {
        try {
            const idProducto = req.params.id;
            if (!idProducto || isNaN(+idProducto)) throw new Error("El ID enviado debe ser un número");

            const product = await this.getProductByIdUseCase.execute(+idProducto);
            if (!product) throw new Error("Producto no encontrado");
            res.json(product);
        } 
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async registerSuggestion(req: Request, res: Response) {
        try {
            const SuggestionData = ValidateSuggestion(req.body);
            if (!SuggestionData.success) {
                const mensajes = SuggestionData.error.errors.map(e => e.message).join(", ")
                throw new Error(`${mensajes}`);
            }
            
            const suggestion = await this.registerSuggestionUseCase.execute(SuggestionData.data);
            res.json(suggestion);
        } 
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async findSuggestion(req: Request, res: Response) {
        try {
            const { idProducto, fechaDesde } = req.query;
            if (!idProducto || isNaN(+idProducto)) throw new Error("El ID enviado debe ser un número");
            if (!fechaDesde) throw new Error("La fecha desde es requerida");

            const date = new Date(fechaDesde as string);
            if (isNaN(date.getTime())) throw new Error("Fecha inválida");

            const suggestion = await this.getOneSuggestionUseCase.execute(+idProducto, date);
            if (!suggestion) throw new Error("Sugerencia no encontrada");
            res.json(suggestion);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async modifySuggestion(req: Request, res: Response) {
        try {
            const { idProducto, fechaDesde } = req.query;
            if (!idProducto || isNaN(+idProducto)) throw new Error("El ID enviado debe ser un número");
            if (!fechaDesde) throw new Error("La fecha desde es requerida");

            const date = new Date(fechaDesde as string);
            if (isNaN(date.getTime())) throw new Error("Fecha inválida");

            const suggestionData = ValidateSuggestionPartial(req.body);
            if (!suggestionData.success) {
                const mensajes = suggestionData.error.errors.map(e => e.message).join(", ");
                throw new Error(`${mensajes}`);
            }

            const modifiedSuggestion = await this.modifySuggestionUseCase.execute(suggestionData.data, +idProducto, date);
            res.json(modifiedSuggestion);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}