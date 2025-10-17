import { useCallback, useMemo, useState } from "react";
import { useSuggestions } from "../hooks/useSuggestions";
import { type SelectChangeEvent } from "@mui/material";
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

            <div className="w-full flex flex-col justify-center items-center sm:px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 w-full max-w-7xl mt-6 mb-2">
                    <ModalCreateSuggestions />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <SuggestionsFilters filter={filter} onFilterChange={handleFilterChange}/>
                        <SortBySelect sortBy={sortBy} onSortChange={handleSortChange}/>
                    </div>
                </div>

                <section aria-label="listado de sugerencias" className="flex flex-col items-center justify-center w-full sm:p-4">
                    { suggestions.length > 0 && <SuggestionsList suggestions={suggestions}/> }
                    { isLoading && (
                        <>
                            <div className="w-full min-h-[50vh] font-sans flex items-center justify-center">
                                <div className="bg-white rounded-lg p-8 shadow-md text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Cargando sugerencias...</p>
                                </div>
                            </div>
                        </>
                    )}
                    { isError && (
                        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6">
                            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-6 max-w-md text-center shadow-md">
                            <h2 className="text-xl font-bold mb-2">Error</h2>
                            <p className="mb-4">No se pudo cargar las sugerencias. Por favor, intente nuevamente.</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-md transition active:scale-95"
                            >
                                Reintentar
                            </button>
                            </div>
                        </div>
                    )}
                    { !isLoading && !isError && suggestions.length === 0 && (
                        <div className="min-h-[50vh] flex flex-col items-center justify-center w-full p-6">
                            <div className="text-center py-20 bg-white border-t-3 border-t-gray-200 rounded-2xl shadow-lg p-10">
                                <h2 className="text-2xl font-semibold text-[#6B6B6B]">Sin sugerencias</h2>
                                <p className="text-[#929292] mt-2">No hay sugerencias cargadas en este momento. Comience por crear una nueva.</p>
                            </div>
                        </div>
                    )}
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