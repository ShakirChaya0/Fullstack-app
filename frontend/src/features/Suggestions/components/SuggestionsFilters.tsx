import { Button, ButtonGroup } from "@mui/material";

export default function SuggestionsFilters({ filter, setFilter }: { filter: "ALL" | "Actives", setFilter: (filter: "ALL" | "Actives") => void }) {
    return(
        <section aria-label="filtros" className="my-4">
            <ButtonGroup variant="contained" aria-label="filtros de sugerencias">
                <Button variant={`${filter === "ALL" ? "contained" : "outlined"}`} onClick={() => setFilter("ALL")}>
                    Todas
                </Button>
                <Button variant={`${filter === "ALL" ? "outlined" : "contained"}`} onClick={() => setFilter("Actives")}>
                    Activas
                </Button>
            </ButtonGroup>
        </section>
    )
}