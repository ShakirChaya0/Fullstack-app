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
                <Button
                    variant={filter === "ALL" ? "contained" : "outlined"}
                    onClick={() => onFilterChange("ALL")}
                    sx={{
                        backgroundColor: filter === "ALL" ? '#0F766E' : 'transparent',
                        color: filter === "ALL" ? '#fff' : '#0F766E',
                        borderColor: '#0F766E',
                        '&:hover': {
                            backgroundColor: filter === "ALL" ? '#115E59' : 'rgba(15,118,110,0.1)',
                            borderColor: '#115E59',
                        },
                    }}
                >
                    Todas
                </Button>
                
                <Button
                    variant={filter === "ACTIVES" ? "contained" : "outlined"}
                    onClick={() => onFilterChange("ACTIVES")}
                    sx={{
                        backgroundColor: filter === "ACTIVES" ? '#0F766E' : 'transparent',
                        color: filter === "ACTIVES" ? '#fff' : '#0F766E',
                        borderColor: '#0F766E',
                        '&:hover': {
                            backgroundColor: filter === "ACTIVES" ? '#115E59' : 'rgba(15,118,110,0.1)',
                            borderColor: '#115E59',
                        },
                    }}
                >
                    Activas
                </Button>
                </ButtonGroup>
            </div>
        </section>
    )
}