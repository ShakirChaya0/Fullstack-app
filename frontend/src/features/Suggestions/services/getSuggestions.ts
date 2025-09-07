import type { Suggestion } from "../interfaces/Suggestion";
import type { SuggFilters, SuggSortBy } from "../types/SuggSharedTypes";

export const getSuggestions = async (filter: SuggFilters, sorted: SuggSortBy, currentPage: unknown): Promise<Suggestion[]> => {
    const query = `page=${currentPage}&filter=${filter}&sorted=${sorted}`;
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sugerencias?${query}`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}