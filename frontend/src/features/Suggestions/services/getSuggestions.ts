import type { Suggestion } from "../interfaces/Suggestion";

export const getSuggestions = async (filter: "ALL" | "Actives"): Promise<Suggestion[]> => {
    const endpoint = filter === "ALL" ? "sugerencias" : "sugerencias/activas";
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}