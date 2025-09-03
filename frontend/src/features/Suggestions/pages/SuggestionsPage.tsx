import { useState } from "react";
import { useSuggestions } from "../hooks/useSuggestions";
import { CircularProgress } from "@mui/material";
import SuggestionsList from "../components/SuggestionsList";
import SuggestionsFilters from "../components/SuggestionsFilters";

type SuggFilters = "ALL" | "Actives";

export default function SuggestionsPage() {
    const [ filter, setFilter ] = useState<SuggFilters>('ALL');
    const [ isLoading, isError, data ] = useSuggestions(filter);
    const suggestions = data ?? [];

    return(
        <>
            <main className="flex flex-col items-center justify-start w-full p-4">
                <h1 className="">Sugerencias</h1>
                <SuggestionsFilters filter={filter} setFilter={setFilter}/>
                <section aria-label="listado de sugerencias" className="flex flex-col items-center justify-center w-full p-4">
                    { isLoading && <CircularProgress size="3rem" /> }
                    { isError && <p>Error al cargar las sugerencias</p> }
                    { !isLoading && !isError && suggestions.length === 0 && <p>No hay sugerencias</p> }
                    { !isLoading && !isError && suggestions.length > 0 && <SuggestionsList suggestions={suggestions}/> }
                </section>
            </main>
        </>
    )
}