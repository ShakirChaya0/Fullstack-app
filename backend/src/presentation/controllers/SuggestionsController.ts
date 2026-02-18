import { Request, Response, NextFunction } from 'express';
import { CUU20RegisterSuggestion } from '../../application/use_cases/SuggestionsUseCases/CUU20RegisterSuggestion.js';
import { CUU21ModifySuggestion } from '../../application/use_cases/SuggestionsUseCases/CUU21ModifySuggestion.js';
import { GetSuggestionsUseCase } from '../../application/use_cases/SuggestionsUseCases/GetSuggestionsUseCase.js';
import { GetOneSuggestionUseCase } from '../../application/use_cases/SuggestionsUseCases/GetOneSuggestion.js';
import { ValidateSuggestion, ValidateSuggestionPartial } from '../../shared/validators/SuggestionZod.js';
import { ValidationError } from '../../shared/exceptions/ValidationError.js';
import { SuggFilterOption, SuggSortOption } from '../../shared/types/SharedTypes.js';

export class SuggestionsController {
    constructor(
        private readonly getSuggestionsUseCase = new GetSuggestionsUseCase(),
        private readonly registerSuggestionUseCase = new CUU20RegisterSuggestion(),
        private readonly getOneSuggestionUseCase = new GetOneSuggestionUseCase(),
        private readonly modifySuggestionUseCase = new CUU21ModifySuggestion()
    ) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, filter, sorted } = req.query
            const draft = (page && !isNaN(+page)) ? +page : 1;

            const filterOption: SuggFilterOption =
                typeof filter === "string" && (["ALL", "ACTIVES"] as const).includes(filter as SuggFilterOption)
                    ? (filter as SuggFilterOption)
                    : "ALL";

            const sortOption: SuggSortOption =
                typeof sorted === "string" && (["DATE_ASC", "DATE_DESC", "NAME_ASC", "NAME_DESC"] as const).includes(sorted as SuggSortOption)
                    ? (sorted as SuggSortOption)
                    : "DATE_DESC";

            const suggestions = await this.getSuggestionsUseCase.execute(draft, filterOption, sortOption);
            res.json(suggestions);
        } 
        catch (error) {
            next(error);
        }
    }

    public async registerSuggestion(req: Request, res: Response, next: NextFunction) {
        try {
            const SuggestionData = ValidateSuggestion(req.body);
            if (!SuggestionData.success) {
                const mensajes = SuggestionData.error.errors.map(e => e.message).join(", ")
                throw new ValidationError(`${mensajes}`);
            }
            
            const suggestion = await this.registerSuggestionUseCase.execute(SuggestionData.data);
            res.status(201).json(suggestion);
        } 
        catch (error) {
            next(error);
        }
    }

    public async findSuggestion(req: Request, res: Response, next: NextFunction) {
        try {
            const { idProducto, fechaDesde } = req.query;
            if (!idProducto || isNaN(+idProducto)) throw new ValidationError("El ID enviado debe ser un número");
            if (!fechaDesde) throw new ValidationError("La fecha desde es requerida");

            const date = new Date(fechaDesde as string);
            if (isNaN(date.getTime())) throw new ValidationError("Fecha inválida");

            const suggestion = await this.getOneSuggestionUseCase.execute(+idProducto, date);
            res.json(suggestion);
        }
        catch (error) {
            next(error);
        }
    }

    public async modifySuggestion(req: Request, res: Response, next: NextFunction) {
        try {
            const { idProducto, fechaDesde } = req.query;
            if (!idProducto || isNaN(+idProducto)) throw new ValidationError("El ID enviado debe ser un número");
            if (!fechaDesde) throw new ValidationError("La fecha desde es requerida");

            const date = new Date(fechaDesde as string);
            if (isNaN(date.getTime())) throw new ValidationError("Fecha inválida");

            const suggestionData = ValidateSuggestionPartial(req.body);
            if (!suggestionData.success) {
                const mensajes = suggestionData.error.errors.map(e => e.message).join(", ");
                throw new ValidationError(`${mensajes}`);
            }

            const modifiedSuggestion = await this.modifySuggestionUseCase.execute(suggestionData.data, +idProducto, date);
            res.status(201).json(modifiedSuggestion);
        }
        catch (error) {
            next(error);
        }
    }
}