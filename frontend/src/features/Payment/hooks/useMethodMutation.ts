import { useMutation } from "@tanstack/react-query";
import { useAppSelector } from "../../../shared/hooks/store";
import useApiClient from "../../../shared/hooks/useApiClient";
import { selectPaymentMethod } from "../services/selectPaymentMethod";
import type { PaymentMethod } from "../types/PaymentSharedTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export function useMethodMutation() {
    const { apiCall } = useApiClient();
    const order = useAppSelector((state) => state.order); 
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: (method: PaymentMethod) => selectPaymentMethod(1, method, apiCall), // cambiar el 1 por order.idPedido
        onSuccess: (data) => {
            if (data) window.location.href = data.redirect_url;
            else navigate("/Cliente/Pedido/Pago/Pendiente");
        },
        onError: (error) => {
            toast.error(`Error al seleccionar el método de pago: ${error.message}`);
            navigate("/Cliente/Pedido/Pago/Fallo");
        },
    });
}