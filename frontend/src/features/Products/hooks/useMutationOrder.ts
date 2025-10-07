import { useMutation } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import { createOrder } from "../../Order/services/createOrder";
import type { Pedido } from "../../Order/interfaces/Order";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useOrderActions } from "../../../shared/hooks/useOrderActions";


export function useMutationOrderRegistration(order: Pedido) {
    const { apiCall } = useApiClient()
    const navigate  = useNavigate()
    const { handleAssignOrderId } = useOrderActions()

    const saveOrderMutation = useMutation({
        mutationFn: () => createOrder(apiCall, order),
        onSuccess: (data) => {
            if ( typeof data === 'string') {
                toast.error('Error al registrar el pedido')
                return
            }
            console.log('Estoy en Mutation')
            console.log(data)

            handleAssignOrderId(data.idPedido)

            toast.success('Pedido registrado con exito')
            navigate('/Cliente/Menu/PedidoConfirmado/')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return { saveOrderMutation }
}