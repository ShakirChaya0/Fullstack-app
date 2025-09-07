import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import updateSuggestion from "../services/updateSuggestion";
import createSuggestion from "../services/createSuggestion";
import type { Suggestion } from "../interfaces/Suggestion";

interface SuggestionPayload {
    _product: { _productId: number; _name: string; _description: string };
    _dateFrom: string;
    _dateTo: string;
}

interface UseSuggMutationParams {
    handleClose: () => void;
    handleError: (message: string | null) => void;
    suggestion: Suggestion | undefined;
}

export function useSuggMutation({ handleClose, handleError, suggestion }: UseSuggMutationParams) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: SuggestionPayload) => {
            if (suggestion) {
                return updateSuggestion({
                    _previousProductId: suggestion._product._productId,
                    _previousDateFrom: suggestion._dateFrom,
                    _product: data._product,
                    _dateFrom: data._dateFrom,
                    _dateTo: data._dateTo
                });
            } else {
                return createSuggestion({
                    _product: data._product!,
                    _dateFrom: data._dateFrom,
                    _dateTo: data._dateTo
                });
            }
        },        
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["suggestions"] });
            toast.success(`Se ${suggestion ? "modificó" : "creó"} la sugerencia con exito`)
            handleError(null);
            handleClose();
        },
        onError: (err) => {
            toast.error(`Error al ${suggestion ? "modificar" : "crear"} la sugerencia`);
            if (err instanceof Error) handleError(err.message);
            console.log(err)
        }
    })
}