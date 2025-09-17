import { useCallback, useState } from "react";
import ProductAutocomplete from "../../Products/components/ProductAutocomplete";
import { useForm } from "react-hook-form";
import dateParser from "../../../shared/utils/dateParser";
import type { Suggestion } from "../interfaces/Suggestion";
import { useSuggMutation } from "../hooks/useSuggMutation";


interface SuggestionFormProps {
    handleClose: () => void;
    suggestion?: Suggestion;
}

type FormData = {
    Producto: string,
    FechaDesde: string,
    FechaHasta: string
};


export default function SuggestionForm({ handleClose, suggestion }: SuggestionFormProps) {
    const previousProduct = suggestion?._product || null;
    const [ selectedProduct, setSelectedProduct ] = useState<{ _productId: number; _name: string; _description: string } | null>(previousProduct);
    const [ error, setError ] = useState<string | null>(null);

    const {
        register,           
        handleSubmit,       
        watch,
        formState: { errors },
        control
    } = useForm<FormData>();

    const handleError = useCallback((message: string | null) => {
        setError(message);
    }, []);

    const { mutate } = useSuggMutation({ handleClose, handleError, suggestion });

    const handleProductSelect = useCallback((product: { _productId: number; _name: string; _description: string } | null) => {
        setSelectedProduct(product);
    }, []);

    const onSubmit = (data: FormData) => {
        mutate({ _product: selectedProduct!, _dateFrom: dateParser(data.FechaDesde), _dateTo: dateParser(data.FechaHasta) });
    };

    const fechaDesdeValue = watch("FechaDesde");
    const today = new Date().toISOString().split("T")[0];

    return (
        <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-bold mb-4">{suggestion ? "Modificar" : "Crear"} Sugerencia</h2>
            
            <div className="flex flex-col gap-6 mb-10">

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-800">Producto</label>
                    <ProductAutocomplete 
                        control={control} 
                        name="Producto" 
                        onSelect={handleProductSelect} 
                        product={ 
                            suggestion ? 
                            { 
                                _productId: suggestion._product._productId, 
                                _name: suggestion._product._name, 
                                _description: suggestion._product._description 
                            }
                            : undefined
                        }
                    />
                    {selectedProduct && <p className="mt-2 text-gray-600">Producto seleccionado: <span className="font-semibold">{selectedProduct._name}</span></p>}
                    {selectedProduct && <p className="text-sm text-gray-500">{selectedProduct._description}</p>}
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-800">Fecha Desde</label>
                        <input 
                            type="date"
                            {...register("FechaDesde", {
                                required: "La fecha desde es obligatoria",
                            })}
                            min={new Date().toISOString().split("T")[0]}
                            className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition" 
                            defaultValue={suggestion ? new Date(suggestion._dateFrom).toISOString().split("T")[0] : ""}
                        />
                        {errors.FechaDesde && <p className="text-base text-red-500">{errors.FechaDesde.message}</p>}    
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-800">Fecha Hasta</label>
                        <input 
                            type="date"
                            {...register("FechaHasta", {
                                required: "La fecha hasta es obligatoria",
                                validate: (value) => {
                                    const from = fechaDesdeValue;
                                    const to = value;

                                    if (to < today) return "Debe ser mayor o igual a hoy";
                                    if (from && to < from) return "Debe ser mayor o igual a la fecha desde";
                                    
                                    return true;
                                },
                            })}
                            min={fechaDesdeValue || today}
                            className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition" 
                            defaultValue={suggestion ? new Date(suggestion._dateTo).toISOString().split("T")[0] : ""}
                        />
                        {errors.FechaHasta && <p className="text-base text-red-500">{errors.FechaHasta.message}</p>}
                    </div>
                </div>

                {error && <p className="text-base text-center text-red-500">{error}</p>}
            </div>
            <div className="flex justify-between gap-6">
                <button type="button" onClick={handleClose} className="w-full bg-white border-2 border-gray-700 hover:bg-gray-200 font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer">
                    Cancelar
                </button>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer">
                    {suggestion ? "Modificar" : "Crear"}
                </button>
            </div>

        </form>
    )
}