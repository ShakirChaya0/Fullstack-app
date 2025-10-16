import CardIcon from "../../Payment/assets/visa_mc_icon.png"
import CashIcon from "../../Payment/assets/cash_icon.png"
import DebitIcon from "../../Payment/assets/debitCard.png"
import { type FormEvent } from "react";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { usePaymentMutation } from "../hooks/usePaymentMutation";
import type { ITable } from "../interfaces/ITable";
import type { PaymentMethod } from "../../Payment/types/PaymentSharedTypes";

type PaymentMethodSelectorProps = {
    onClose: () => void;
    currentTable: ITable
};

export default function PaymentMethodSelector({ onClose, currentTable }: PaymentMethodSelectorProps) {
    const { mutate, isPending, isSuccess } = usePaymentMutation(currentTable._orders?.at(-1)?.idPedido ?? 1);

    if (isSuccess) onClose()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const data = Object.fromEntries(form.entries());

        if (!data.paymentMethod) {
            toast.warn("Debe seleccionar un método de pago");
            return
        }

        console.log(data.paymentMethod)

        mutate((data.paymentMethod as PaymentMethod))
    }

    return (
        <section>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="bg-teal-600 p-4 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">Seleccionar método de pago:</h2>
                </div>

                <div className="flex flex-col gap-2 px-6">
                    <label className="has-checked:bg-[var(--neutral-200)] cursor-pointer transition-all duration-200 ease-in-out flex items-center space-x-3 bg-[var(--neutral-100)] rounded-lg sm:rounded-xl h-16 p-2">
                        <img src={CardIcon} alt="Tarjetas de Crédito/Débito" className="w-10 sm:w-15" />

                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="Credito" 
                            className="form-radio hidden text-orange-600"
                            disabled={isPending}
                        />
                        <span className="text-lg">Tarjeta de Crédito</span>
                    </label>

                    <label className="has-checked:bg-[var(--neutral-200)] cursor-pointer transition-all duration-200 ease-in-out flex items-center space-x-3 bg-[var(--neutral-100)] rounded-lg sm:rounded-xl h-16 p-2">
                        <img src={DebitIcon} alt="Tarjetas de Crédito/Débito" className="w-10 sm:w-15" />

                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="Debito" 
                            className="form-radio hidden text-orange-600"
                            disabled={isPending}
                        />
                        <span className="text-lg">Tarjeta de Débito</span>
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
                        className="flex items-center justify-center cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-100 active:scale-95"
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