import { useMutation } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import { createOrder } from "../../Order/services/createOrder";
import type { Pedido } from "../../Order/interfaces/Order";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";


export function useMutationOrderRegistration( order: Pedido){
    const { apiCall } = useApiClient()
    const navigate = useNavigate()

    const saveOrderMutation = useMutation({
        mutationFn: () => createOrder(apiCall, order),
        onSuccess: (data) => {
            if ( typeof data === 'string') {
                toast.error('Error al registrar el pedido')
                return
            }

            toast.success('Pedido registrado con exito')
            navigate('/Mozo/MesasDelRestaurante/')
        },
        onError: () => {
            toast.error('Error al registrar el pedido')
        }
    })
    return { saveOrderMutation }
}