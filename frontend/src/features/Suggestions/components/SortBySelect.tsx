import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import type { SuggSortBy } from "../types/SuggSharedTypes";

interface SortBySelectProps {
    sortBy: SuggSortBy;
    onSortChange: (event: SelectChangeEvent) => void;
}

export default function SortBySelect({ sortBy, onSortChange }: SortBySelectProps) {
    return (
        <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel id="select-sort-label">Ordenar Por</InputLabel>
            <Select
                labelId="select-sort-label"
                id="select-sort"
                value={sortBy}
                label="Ordenar Por"
                onChange={onSortChange}
            >
                <MenuItem value={"DATE_DESC"}>Más Reciente</MenuItem>
                <MenuItem value={"DATE_ASC"}>Más Antigua</MenuItem>
                <MenuItem value={"NAME_ASC"}>Producto, A-Z</MenuItem>
                <MenuItem value={"NAME_DESC"}>Producto, Z-A</MenuItem>
            </Select>
        </FormControl>
    );
}