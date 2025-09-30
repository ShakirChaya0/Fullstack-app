import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchProducts } from "../services/searchProducts";
import useApiClient from "../../../shared/hooks/useApiClient";

interface Product {
    _productId: number;
    _name: string;
    _description: string;
}

interface ProductAutocompleteProps {
    control: any;
    name: string; 
    onSelect: (p: Product | null) => void;
    product?: Product;
}

export default function ProductAutocomplete({ control, name, onSelect, product }: ProductAutocompleteProps) {
    const [inputValue, setInputValue] = useState("");
    const { apiCall } = useApiClient()

    const { data: options = [], isLoading } = useQuery({
        queryKey: ["products", inputValue],
        queryFn: () => searchProducts(apiCall, inputValue),
        enabled: inputValue.length > 1,
    });

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={product || inputValue}
            rules={{ required: "El producto es obligatorio" }}
            render={({ field, fieldState }) => (
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option._name}
                    loading={isLoading}
                    value={field.value || null}
                    onChange={(_, newValue) => {
                        field.onChange(newValue);
                        onSelect(newValue);
                    }}
                    onInputChange={(_, value) => setInputValue(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Nombre del producto..."
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "0.75rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            transition: "all 0.2s",
                            "& fieldset": {
                                borderColor: "#D1D5DB",
                            },
                            "&:hover fieldset": {
                                borderColor: "#D1D5DB",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#D97706",
                                borderWidth: "2px",
                            },
                        },
                    }}
                />
            )}
        />
    );
}
