import { useMutation } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import { toast } from "react-toastify";
import { payOrder } from "../services/payOrder";
import type { PaymentMethod } from "../../Payment/types/PaymentSharedTypes";

export function usePaymentMutation(idPedido: number) {
    const { apiCall } = useApiClient();
    
    return useMutation({
        mutationFn: (method: PaymentMethod) => payOrder(apiCall, idPedido, method), 
        onSuccess: () => {
            toast.success("Se cobró con éxito el pedido")
        },
        onError: (error) => {
            console.log(error)
            toast.error(`Error al seleccionar el método de pago: ${error.message}`);
        },
    });
}