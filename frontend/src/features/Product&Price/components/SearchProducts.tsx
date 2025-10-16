import "tailwindcss"
import { TextField } from "@mui/material";
import type { SearchProductsProps } from "../interfaces/product&PriceInterfaces";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import debounce from 'just-debounce-it'
import { useCallback, useState } from "react";


export function SearchProducts({ filtersToSearch, updateFilter }: SearchProductsProps) {
    const [inputValue, setInputValue] = useState(filtersToSearch);
    
    const handleOpenModal = () => {
        // Implementación de modal
        // Opción 1: Evento personalizado: Dispatch que abre la modal
        window.dispatchEvent(new CustomEvent('openNewProductModal'));
    }

    const debounceSearch = useCallback( 
        debounce((newInputValue: string) => {
            updateFilter("search", newInputValue)
        }, 750)    
    , [updateFilter])

    const handleChange = (newInputValue: string) => {
        if(newInputValue.startsWith(' ')) return
        setInputValue(newInputValue)
        debounceSearch(newInputValue)
    }

    return (
        <div className="flex flex-row justify-between gap-2 items-center my-3">
            <div className="flex flex-row flex-1 items-center rounded-lg bg-white transition-all duration-200 border border-gray-200
            hover:border-cyan-500 hover:shadow-[0_0_5px_2px_rgba(14,116,144,0.5)]
            focus-within:border-cyan-500 focus-within:shadow-[0_0_5px_2px_rgba(14,116,144,0.5)] h-[40px]">
                <SearchIcon className="text-gray-400 mx-2 text-[20px]"/>
                <TextField
                    placeholder="Buscador"
                    className="w-full"
                    id="searchTool"
                    value={ inputValue }
                    onChange={(e) => handleChange(e.target.value)}
                    autoComplete="off"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none',
                            },
                            '&:hover fieldset': {
                                border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                                border: 'none',
                            },
                        },
                    }}
                />
            </div>
            <button 
                onClick={handleOpenModal}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 
                rounded-lg font-medium transition-colors duration-200 whitespace-nowrap h-[40px] hover:cursor-pointer"
            >
                <div className="block sm:hidden">
                    <AddCircleIcon fontSize="small" sx={{mb: '0.1rem'}}/>
                </div>
                <span className="hidden sm:block">
                    <AddCircleIcon fontSize="small" sx={{mr: '0.5rem', mb: '0.1rem'}}/>
                    Nuevo Producto
                </span>
            </button>
        </div>
    )
}