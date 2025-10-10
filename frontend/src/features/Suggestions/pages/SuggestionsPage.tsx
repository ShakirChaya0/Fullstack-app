import { useCallback, useMemo, useState } from "react";
import { useSuggestions } from "../hooks/useSuggestions";
import { CircularProgress, type SelectChangeEvent } from "@mui/material";
import SuggestionsList from "../components/SuggestionsList";
import SuggestionsFilters from "../components/SuggestionsFilters";
import SortBySelect from "../components/SortBySelect";
import ModalCreateSuggestions from "../components/ModalCreateSuggestions";
import type { SuggFilters, SuggSortBy } from "../types/SuggSharedTypes";


export default function SuggestionsPage() {
    const [ filter, setFilter ] = useState<SuggFilters>('ALL');
    const [ sortBy, setSortBy ] = useState<SuggSortBy>('DATE_DESC');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useSuggestions(filter, sortBy);

    const suggestions = useMemo(() => {
        if (!data) return [];
        return data.pages.flat();
    }, [data]);

    const handleFilterChange = useCallback((newFilter: SuggFilters) => {
        setFilter(newFilter);
    }, []);

    const handleSortChange = useCallback((event: SelectChangeEvent) => {
        setSortBy(event.target.value as SuggSortBy);
    }, []);

    return (
        <section className="flex flex-col items-center justify-start w-full">
            <div className="w-full bg-white shadow-md mb-2 p-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Sugerencias</h1>
            </div>

            <div className="flex flex-col justify-center items-center sm:px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 w-full max-w-7xl mt-6 mb-2">
                    <ModalCreateSuggestions />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <SuggestionsFilters filter={filter} onFilterChange={handleFilterChange}/>
                        <SortBySelect sortBy={sortBy} onSortChange={handleSortChange}/>
                    </div>
                </div>

                <section aria-label="listado de sugerencias" className="flex flex-col items-center justify-center w-full sm:p-4">
                    { suggestions.length > 0 && <SuggestionsList suggestions={suggestions}/> }
                    { isLoading && <CircularProgress size="3rem" /> }
                    { isError && <p className="text-base text-center text-red-500">Error al cargar las sugerencias</p> }
                    { !isLoading && !isError && suggestions.length === 0 && <p>No hay sugerencias</p> }
                    { hasNextPage && 
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="mt-8 bg-neutral-700 hover:bg-neutral-800 text-white p-3 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer"
                        >
                            {isFetchingNextPage ? "Cargando..." : "Cargar más sugerencias"}
                        </button>
                    }
                </section>
            </div>
        </section>
    )
}