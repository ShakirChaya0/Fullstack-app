import "tailwindcss"
import { Autocomplete, TextField } from "@mui/material";
import type { SearchProductsProps } from "../interfaces/product&PriceInterfaces";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';


export function SearchProducts({ filtersToSearch, updateFilter, allProducts }: SearchProductsProps) {
    
    const handleOpenModal = () => {
        // Implementación de modal
        // Opción 1: Evento personalizado: Dispatch que abre la modal
        window.dispatchEvent(new CustomEvent('openNewProductModal'));
    }

    return (
        <div className="flex flex-row justify-between gap-2 items-center my-3">
            <div className="flex flex-row items-center w-[60%] sm:w-[60%] md:w-[70%] lg:w-[80%] rounded-lg bg-white transition-all duration-200 border border-gray-200
            hover:border-cyan-500 hover:shadow-[0_0_5px_2px_rgba(14,116,144,0.5)]
            focus-within:border-cyan-500 focus-within:shadow-[0_0_5px_2px_rgba(14,116,144,0.5)] h-[40px]">
                <SearchIcon className="text-gray-400 mx-2 text-[20px]"/>
                <Autocomplete
                    className="w-full"
                    id="searchTool"
                    freeSolo
                    value={ filtersToSearch }
                    onInputChange={(_, newInputValue) => {
                        updateFilter("search", newInputValue);
                    }}
                    options={allProducts.map((option) => {return `${option.idProducto} - ${option.nombre}`})}
                    filterOptions={(options, params) => {
                        // Mostrar opciones si hay al menos 1 carácter
                        if (params.inputValue.length === 0) {
                            return [];
                        }
                        return options.filter((option) =>
                            option.toLowerCase().includes(params.inputValue.toLowerCase())
                        );
                    }}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            placeholder="Buscador"
                            slotProps={
                                {
                                    inputLabel: {shrink: false, style: { display: 'none' }},
                                    input: {
                                        ...params.InputProps,
                                        disableUnderline: true,
                                        sx: {
                                            '& fieldset': { border: 'none' },
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        }
                                    }
                                }
                            }
                        />
                    )}
                />
            </div>
            <button 
                onClick={handleOpenModal}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 
                rounded-lg font-medium transition-colors duration-200 whitespace-nowrap h-[40px] hover:cursor-pointer"
            >
                <span className="text-lg font-bold mb-1"><AddCircleIcon fontSize="small"/></span>
                Nuevo Producto
            </button>
        </div>
    )
}