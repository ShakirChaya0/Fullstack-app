import { useMutation } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import { createOrder } from "../../Order/services/createOrder";
import type { OrderWithTableId } from "../../Order/interfaces/Order";
import { toast } from "react-toastify";

export default function useSaveTableOrder() {
    const { apiCall } = useApiClient()

    return useMutation({
        mutationFn: (order: OrderWithTableId) => createOrder(apiCall, order),
        onSuccess: () => {
            toast.success("Pedido creado con exito")
        },
        onError: (err) => {
            toast.error("Error al intentar crear el Pedido")
            console.log(err)
        }
    })
}