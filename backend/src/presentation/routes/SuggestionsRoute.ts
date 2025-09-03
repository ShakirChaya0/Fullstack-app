import { Router } from "express";
import { SuggestionsController } from "../controllers/SuggestionsController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

export function SuggestionsRouter () {
    const suggestionsRouter = Router();
    const suggestionsController = new SuggestionsController();
    
    suggestionsRouter.get("/", /* AuthMiddleware, RoleMiddleware(["SectorCocina", "Administrador"]), */ (req, res, next) => { suggestionsController.getAll(req, res, next) });

    suggestionsRouter.get("/activas", (req, res, next) => { suggestionsController.getActive(req, res, next) });

    suggestionsRouter.get("/search", (req, res, next) => { suggestionsController.findSuggestion(req, res, next) });
    
    suggestionsRouter.post("/", /* AuthMiddleware, RoleMiddleware(["SectorCocina"]), */ (req, res, next) => { suggestionsController.registerSuggestion(req, res, next) });

    suggestionsRouter.patch("/", /* AuthMiddleware, RoleMiddleware(["SectorCocina"]), */ (req, res, next) => { suggestionsController.modifySuggestion(req, res, next) });

    return suggestionsRouter;
}