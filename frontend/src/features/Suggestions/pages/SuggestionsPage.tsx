import { useCallback, useMemo, useState } from "react";
import { useSuggestions } from "../hooks/useSuggestions";
import { CircularProgress, type SelectChangeEvent } from "@mui/material";
import SuggestionsList from "../components/SuggestionsList";
import SuggestionsFilters from "../components/SuggestionsFilters";
import SortBySelect from "../components/SortBySelect";
import ModalCreateSuggestions from "../components/ModalCreateSuggestions";

type SuggFilters = "ALL" | "Actives";
type SuggSortBy = "latest" | "oldest" | "A-Z" | "Z-A";

export default function SuggestionsPage() {
    const [ filter, setFilter ] = useState<SuggFilters>('ALL');
    const [ sortBy, setSortBy ] = useState<SuggSortBy>('latest');
    const [ isLoading, isError, data ] = useSuggestions(filter);

    const suggestions = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            switch (sortBy) {
                case "latest":
                    return new Date(b._dateFrom).getTime() - new Date(a._dateFrom).getTime();
                case "oldest":
                    return new Date(a._dateFrom).getTime() - new Date(b._dateFrom).getTime();
                case "A-Z":
                    return a._product._name.localeCompare(b._product._name);
                case "Z-A":
                    return b._product._name.localeCompare(a._product._name);
                default:
                    return 0;
            }
        });
    }, [data, sortBy]);

    const handleFilterChange = useCallback((newFilter: SuggFilters) => {
        setFilter(newFilter);
    }, []);

    const handleSortChange = useCallback((event: SelectChangeEvent) => {
        setSortBy(event.target.value as SuggSortBy);
    }, []);

    return (
        <>
            <main className="flex flex-col items-center justify-start w-full p-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 mt-6 max-w-7xl">Sugerencias</h1>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 w-full max-w-7xl my-4">
                    <ModalCreateSuggestions />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <SuggestionsFilters filter={filter} onFilterChange={handleFilterChange}/>
                        <SortBySelect sortBy={sortBy} onSortChange={handleSortChange}/>
                    </div>
                </div>

                <section aria-label="listado de sugerencias" className="flex flex-col items-center justify-center w-full p-4">
                    { isLoading && <CircularProgress size="3rem" /> }
                    { isError && <p className="text-base text-center text-red-500">Error al cargar las sugerencias</p> }
                    { !isLoading && !isError && suggestions.length === 0 && <p>No hay sugerencias</p> }
                    { !isLoading && !isError && suggestions.length > 0 && <SuggestionsList suggestions={suggestions}/> }
                </section>
            </main>
        </>
    )
}