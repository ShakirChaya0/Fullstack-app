import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

type SuggSortBy = "latest" | "oldest" | "A-Z" | "Z-A";

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
                <MenuItem value={"latest"}>Más Reciente</MenuItem>
                <MenuItem value={"oldest"}>Más Antigua</MenuItem>
                <MenuItem value={"A-Z"}>Producto, A-Z</MenuItem>
                <MenuItem value={"Z-A"}>Producto, Z-A</MenuItem>
            </Select>
        </FormControl>
    );
}