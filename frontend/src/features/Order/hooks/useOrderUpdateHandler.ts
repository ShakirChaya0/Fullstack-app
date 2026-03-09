import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../shared/hooks/store";
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import { useWebSocket } from "../../../shared/hooks/useWebSocket";
import type { OrderClientInfo, Pedido } from "../interfaces/Order";
import { consolidateOrderLines } from "../utils/consolidateOrderLines";
import { rebuildOrderWithConsolidatedLines } from "../utils/rebuildOrderWithConsolidatedLines";
import { getConsolidatedLinesToModify } from "../utils/getConsolidatedLinesToModify";
import { getLinesToDelete } from "../utils/getLinesToDelete";
import { toast } from "react-toastify";

export const useOrderUpdateHandler = () => {
    const navigate = useNavigate();
    const order = useAppSelector((state) => state.order);
    const { handleRecoveryCurrentState } = useOrderActions();
    const { onEvent, offEvent, sendEvent } = useWebSocket();

    useEffect(() => {
        const handleOrderUpdateByKitchen = (data: OrderClientInfo) => {
            const previousOrderRaw = localStorage.getItem("previousOrder");

            // Caso normal: no hay modificación en vuelo, solo actualizar estado en Redux
            if (!previousOrderRaw) {
                // Consolidar las líneas del backend
                const consolidatedOrderLines = consolidateOrderLines(
                    data.lineasPedido,
                );

                // 🔑 CLAVE: Reconstruir contra `order` del Redux y sincronizar lineNumbers con BD
                // rebuildOrderWithConsolidatedLines ahora actualiza los lineNumber con los nroLinea del backend
                const updatedOrder = rebuildOrderWithConsolidatedLines(
                    order, // ← Redux actual (datos del producto)
                    consolidatedOrderLines, // ← Datos del backend (incluyendo nroLinea correctos)
                );

                updatedOrder.idPedido = data.idPedido;
                updatedOrder.estado = data.estado;
                updatedOrder.observaciones = data.observaciones;

                handleRecoveryCurrentState({
                    updatedPreviousOrder: updatedOrder,
                });
                return;
            }

            // Caso colisión: había una modificación del cliente en vuelo
            const previousOrder: Pedido = JSON.parse(previousOrderRaw);
            const consolidatedOrderLines = consolidateOrderLines(
                data.lineasPedido,
            );
            const updatedPreviousOrder = rebuildOrderWithConsolidatedLines(
                previousOrder,
                consolidatedOrderLines,
            );

            updatedPreviousOrder.idPedido = data.idPedido;
            updatedPreviousOrder.estado = data.estado;
            updatedPreviousOrder.observaciones = data.observaciones;

            const lineasAModificar = getConsolidatedLinesToModify(
                consolidatedOrderLines,
            );

            if (lineasAModificar.length > 0) {
                sendEvent("modifyOrder", {
                    orderId: order.idPedido,
                    lineNumbers: lineasAModificar.map((lp) => lp.nroLinea),
                    data: {
                        items: lineasAModificar.map((lp) => ({
                            cantidad: lp.cantidad,
                        })),
                    },
                });
            }

            const lineasAEliminar = getLinesToDelete(
                data.lineasPedido,
                consolidatedOrderLines,
            );

            lineasAEliminar.forEach((nroLinea) => {
                sendEvent("deleteOrderLine", {
                    orderId: order.idPedido,
                    lineNumber: nroLinea,
                });
            });

            handleRecoveryCurrentState({ updatedPreviousOrder });
            toast.info(
                "La cocina ha actualizado su pedido, no se aplicó su modificación",
            );
            localStorage.removeItem("previousOrder");
            localStorage.removeItem("modification");
            navigate(`/Cliente/Menu/PedidoConfirmado/`);
        };

        // Handler genérico para sincronizar lineNumbers cuando el backend envía actualizaciones
        const handleOrderSync = (data: OrderClientInfo) => {
            const consolidatedOrderLines = consolidateOrderLines(
                data.lineasPedido,
            );
            const updatedOrder = rebuildOrderWithConsolidatedLines(
                order,
                consolidatedOrderLines,
            );

            updatedOrder.idPedido = data.idPedido;
            updatedOrder.estado = data.estado;
            updatedOrder.observaciones = data.observaciones;

            handleRecoveryCurrentState({ updatedPreviousOrder: updatedOrder });
        };

        onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
        onEvent("addedOrderLine", handleOrderSync);
        onEvent("modifiedOrderLine", handleOrderSync);
        onEvent("deletedOrderLine", handleOrderSync);

        return () => {
            offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
            offEvent("addedOrderLine", handleOrderSync);
            offEvent("modifiedOrderLine", handleOrderSync);
            offEvent("deletedOrderLine", handleOrderSync);
        };
    }, []);
};
