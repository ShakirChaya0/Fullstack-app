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
            console.log("🔍 [FinishedOrder] Evento recibido:", {
                idPedido: data.idPedido,
                estado: data.estado,
                lineas: data.lineasPedido.length,
                timestamp: new Date().toISOString(),
            });

            const previousOrderRaw = localStorage.getItem("previousOrder");
            console.log(
                "🔍 [FinishedOrder] previousOrder en localStorage:",
                previousOrderRaw ? "SÍ existe" : "No existe",
            );

            // Caso normal: no hay modificación en vuelo, solo actualizar estado en Redux
            if (!previousOrderRaw) {
                console.log(
                    "✅ [FinishedOrder] Caso normal - reconstruyendo contra Redux actual",
                );
                // Consolidar las líneas del backend
                const consolidatedOrderLines = consolidateOrderLines(
                    data.lineasPedido,
                );
                console.log(
                    "🔍 [FinishedOrder] Líneas consolidadas:",
                    consolidatedOrderLines,
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

                console.log(
                    "🔍 [FinishedOrder] Order reconstruida:",
                    updatedOrder.lineasPedido.map((lp) => ({
                        lineNumbers: lp.lineNumbers,
                        producto: lp.producto._name,
                        estado: lp.estado,
                    })),
                );

                handleRecoveryCurrentState({
                    updatedPreviousOrder: updatedOrder,
                });
                return;
            }

            // Caso colisión: había una modificación del cliente en vuelo
            console.log(
                "⚠️ [FinishedOrder] Caso colisión - procesando modificación",
            );
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
            console.log(
                "🔍 [FinishedOrder] Líneas a modificar:",
                lineasAModificar.length,
            );

            if (lineasAModificar.length > 0) {
                console.log(
                    "📤 [FinishedOrder] Enviando modifyOrder con orderId:",
                    order.idPedido,
                );
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
            console.log(
                "🔍 [FinishedOrder] Líneas a eliminar:",
                lineasAEliminar.length,
            );

            lineasAEliminar.forEach((nroLinea) => {
                console.log(
                    "📤 [FinishedOrder] Enviando deleteOrderLine:",
                    nroLinea,
                );
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
            console.log(
                "🔄 [FinishedOrder] Sincronizando order con backend:",
                data.idPedido,
            );

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

        console.log(
            "📌 [FinishedOrder] Registrando listeners para eventos de pedido",
        );
        onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
        onEvent("addedOrderLine", handleOrderSync);
        onEvent("modifiedOrderLine", handleOrderSync);
        onEvent("deletedOrderLine", handleOrderSync);

        return () => {
            console.log(
                "📌 [FinishedOrder] Removiendo listeners para eventos de pedido",
            );
            offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
            offEvent("addedOrderLine", handleOrderSync);
            offEvent("modifiedOrderLine", handleOrderSync);
            offEvent("deletedOrderLine", handleOrderSync);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
