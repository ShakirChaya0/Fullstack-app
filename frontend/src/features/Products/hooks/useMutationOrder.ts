import { useMutation } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import { createOrder } from "../../Order/services/createOrder";
import type { OrderClientInfo, Pedido } from "../../Order/interfaces/Order";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import type { OrderLineStatus } from "../../KitchenOrders/types/SharedTypes";

export function useMutationOrderRegistration(order: Pedido) {
    const { apiCall } = useApiClient();
    const navigate = useNavigate();
    const { handleRecoveryCurrentState } = useOrderActions();

    const saveOrderMutation = useMutation({
        mutationFn: () => createOrder(apiCall, order),
        onSuccess: (data: OrderClientInfo) => {
            if (typeof data === "string") {
                toast.error("Error al registrar el pedido");
                return;
            }

            // Sincronizar lineNumbers con los nroLinea del backend
            const syncedOrder: Pedido = {
                ...order,
                idPedido: data.idPedido,
                estado: data.estado,
                observaciones: data.observaciones,
                comensales: data.comensales,
                lineasPedido: order.lineasPedido.map((lp) => {
                    // Buscamos todas las líneas correspondientes en la respuesta del backend por nombre de producto
                    const backendLines = data.lineasPedido.filter(
                        (bl) => bl.nombreProducto === lp.producto._name,
                    );
                    return {
                        ...lp,
                        // 🔑 Sincronizamos lineNumbers con todos los nroLinea del backend
                        lineNumbers:
                            backendLines.length > 0
                                ? backendLines
                                      .map((bl) => bl.nroLinea)
                                      .filter(
                                          (n): n is number => n !== undefined,
                                      )
                                : lp.lineNumbers,
                        estado: (backendLines[0]?.estado ??
                            lp.estado) as OrderLineStatus,
                    };
                }),
            };

            handleRecoveryCurrentState({ updatedPreviousOrder: syncedOrder });
            toast.success("Pedido registrado con exito");
            navigate("/Cliente/Menu/PedidoConfirmado/");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { saveOrderMutation };
}
