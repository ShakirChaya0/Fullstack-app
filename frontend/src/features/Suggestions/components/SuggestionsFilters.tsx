import { Button, ButtonGroup } from "@mui/material";
import type { SuggFilters } from "../types/SuggSharedTypes";

interface SortBySelectProps {
    filter: SuggFilters;
    onFilterChange: (newFilter: SuggFilters) => void;
}

export default function SuggestionsFilters({ filter, onFilterChange }: SortBySelectProps) {
    return (
        <section aria-label="filtros">
            <div className="flex flex-row justify-center items-center gap-4 w-full h-full">
                <ButtonGroup variant="contained" aria-label="filtros de sugerencias" className="h-full">
                    <Button variant={`${filter === "ALL" ? "contained" : "outlined"}`} onClick={() => onFilterChange("ALL")}>
                        Todas
                    </Button>
                    <Button variant={`${filter === "ALL" ? "outlined" : "contained"}`} onClick={() => onFilterChange("ACTIVES")}>
                        Activas
                    </Button>
                </ButtonGroup>
            </div>
        </section>
    )
}