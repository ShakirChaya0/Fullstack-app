import MPIcon from "../assets/mercado_pago_icon.png"
import CardIcon from "../assets/visa_mc_icon.png"
import CashIcon from "../assets/cash_icon.png"
import { type FormEvent } from "react";
import type { PaymentMethod } from "../types/PaymentSharedTypes";
import { useMethodMutation } from "../hooks/useMethodMutation";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

type PaymentMethodSelectorProps = {
    onClose: () => void;
};

export default function PaymentMethodSelector({ onClose }: PaymentMethodSelectorProps) {
    const { mutate, isPending } = useMethodMutation();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const data = Object.fromEntries(form.entries());

        if (!data.paymentMethod) {
            toast.warn("Debe seleccionar un método de pago");
            return
        } 
        
        mutate(data.paymentMethod as PaymentMethod)
    }

    return (
        <section>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="bg-[var(--primary-100)] p-4 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">Seleccionar método de pago:</h2>
                </div>

                <div className="flex flex-col gap-2 px-6">
                    <label className="has-checked:bg-[var(--neutral-200)] cursor-pointer transition-all duration-200 ease-in-out flex items-center space-x-3 bg-[var(--neutral-100)] rounded-lg sm:rounded-xl h-16 p-2">
                        <img src={MPIcon} alt="Mercado Pago logo" className="w-10 sm:w-15" />

                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="MercadoPago" 
                            className="form-radio hidden text-orange-600"
                            disabled={isPending}
                        />
                        <span className="text-lg">Mercado Pago</span>
                    </label>

                    <label className="has-checked:bg-[var(--neutral-200)] cursor-pointer transition-all duration-200 ease-in-out flex items-center space-x-3 bg-[var(--neutral-100)] rounded-lg sm:rounded-xl h-16 p-2">
                        <img src={CardIcon} alt="Tarjetas de Crédito/Débito" className="w-10 sm:w-15" />

                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="Credito/Debito" 
                            className="form-radio hidden text-orange-600"
                            disabled={isPending}
                        />
                        <span className="text-lg">Tarjeta de Crédito/Débito</span>
                    </label>

                    <label className="has-checked:bg-[var(--neutral-200)] cursor-pointer transition-all duration-200 ease-in-out flex items-center space-x-3 bg-[var(--neutral-100)] rounded-lg sm:rounded-xl h-16 p-2">
                        <img src={CashIcon} alt="Efectivo" className="w-10 sm:w-15" />
                        
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="Efectivo" 
                            className="form-radio hidden text-orange-600"
                            disabled={isPending}
                        />
                        <span className="text-lg">Efectivo</span>
                    </label>
                </div>

                <div className="flex flex-col-reverse gap-4 sm:flex-row justify-end px-6 pb-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="py-2 px-4 bg-white border-2 border-gray-700 hover:bg-gray-200 font-medium rounded-lg shadow-lg cursor-pointer transition-all duration-100 active:scale-95"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="flex items-center justify-center cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-100 active:scale-95"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                <span className="ml-2">Procesando...</span>
                            </>
                        ) : (
                            'Confirmar Pago'
                        )}
                    </button>
                </div>
            </form>
        </section>    
    )
}