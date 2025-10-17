import { Button, ButtonGroup } from "@mui/material";
import type { SuggFilters } from "../types/SuggSharedTypes";

interface SortBySelectProps {
  filter: SuggFilters;
  onFilterChange: (newFilter: SuggFilters) => void;
}

export default function SuggestionsFilters({
  filter,
  onFilterChange,
}: SortBySelectProps) {
  return (
    <section aria-label="filtros">
      <div className="flex flex-row justify-center items-center gap-4 w-full h-full">
        <ButtonGroup
          variant="contained"
          aria-label="filtros de sugerencias"
          className="h-full"
          sx={{
            // Aplica a TODOS los botones hijos del group y anula outline/box-shadow insistente
            "& .MuiButton-root": {
              outline: "none !important",
              boxShadow: "none !important",
              borderColor: "#0F766E !important",
              // anular el focus visible del navegador y de MUI
              "&:focus": {
                outline: "none !important",
                boxShadow: "none !important",
                borderColor: "#0F766E !important",
              },
              "&:focus-visible": {
                outline: "none !important",
                boxShadow: "none !important",
                borderColor: "#0F766E !important",
              },
              // Firefox inner focus
              "::-moz-focus-inner": { border: 0 },
            },
            // en caso el group reciba foco
            "&:focus": {
              outline: "none !important",
              boxShadow: "none !important",
            },
          }}
        >
          <Button
            variant={filter === "ALL" ? "contained" : "outlined"}
            onClick={() => onFilterChange("ALL")}
            disableFocusRipple
            disableRipple
            disableElevation
            sx={{
              backgroundColor: filter === "ALL" ? "#0F766E" : "transparent",
              color: filter === "ALL" ? "#fff" : "#0F766E",
              borderColor: "#0F766E",
              "&:hover": {
                backgroundColor: filter === "ALL" ? "#115E59" : "rgba(15,118,110,0.06)",
                borderColor: "#115E59",
              },
            }}
          >
            Todas
          </Button>

          <Button
            variant={filter === "ACTIVES" ? "contained" : "outlined"}
            onClick={() => onFilterChange("ACTIVES")}
            disableFocusRipple
            disableRipple
            disableElevation
            sx={{
              backgroundColor: filter === "ACTIVES" ? "#0F766E" : "transparent",
              color: filter === "ACTIVES" ? "#fff" : "#0F766E",
              borderColor: "#0F766E",
              "&:hover": {
                backgroundColor: filter === "ACTIVES" ? "#115E59" : "rgba(15,118,110,0.06)",
                borderColor: "#115E59",
              },
            }}
          >
            Activas
          </Button>
        </ButtonGroup>
      </div>
    </section>
  );
}
