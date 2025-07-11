import { Router } from "express";
import { SuggestionsController } from "../controllers/SuggestionsController.js";

export function SuggestionsRouter () {
    const suggestionsRouter = Router();
    const suggestionsController = new SuggestionsController();
    
    suggestionsRouter.get("/", (req, res, next) => { suggestionsController.getAll(req, res, next) });

    suggestionsRouter.get("/activas", (req, res, next) => { suggestionsController.getActive(req, res, next) });

    suggestionsRouter.get("/producto/:id", (req, res, next) => { suggestionsController.findProduct(req, res, next) });

    suggestionsRouter.post("/", (req, res, next) => { suggestionsController.registerSuggestion(req, res, next) });

    suggestionsRouter.get("/search", (req, res, next) => { suggestionsController.findSuggestion(req, res, next) });

    suggestionsRouter.patch("/", (req, res, next) => { suggestionsController.modifySuggestion(req, res, next) });

    return suggestionsRouter;
}