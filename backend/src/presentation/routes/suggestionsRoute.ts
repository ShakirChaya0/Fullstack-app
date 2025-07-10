import { Router } from "express";
import { SuggestionsController } from "../controllers/SuggestionsController.js";

export function SuggestionsRouter () {
    const suggestionsRouter = Router();
    const suggestionsController = new SuggestionsController();
    
    suggestionsRouter.get("/", (req, res) => { suggestionsController.getAll(req, res) });

    suggestionsRouter.get("/activas", (req, res) => { suggestionsController.getActive(req, res) });

    suggestionsRouter.get("/producto/:id", (req, res) => { suggestionsController.findProduct(req, res) });

    suggestionsRouter.post("/", (req, res) => { suggestionsController.registerSuggestion(req, res) });

    suggestionsRouter.get("/search", (req, res) => { suggestionsController.findSuggestion(req, res) });

    suggestionsRouter.patch("/", (req, res) => { suggestionsController.modifySuggestion(req, res) });

    return suggestionsRouter;
}