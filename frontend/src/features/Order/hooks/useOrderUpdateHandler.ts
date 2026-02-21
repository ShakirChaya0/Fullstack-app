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
  const { handleRecoveryCurrentState, handleModifyOrderStatus } = useOrderActions();
  const { onEvent, offEvent, sendEvent } = useWebSocket();

  useEffect(() => {
    const handleOrderUpdateByKitchen = (data: OrderClientInfo) => {
      const previousOrderRaw = localStorage.getItem('previousOrder');

      // Caso normal: no hay modificación en vuelo, solo actualizar estado en Redux
      if (!previousOrderRaw) {
        handleModifyOrderStatus({ newOrderStatus: data.estado, orderLinesData: data.lineasPedido });
        return;
      }

      // Caso colisión: había una modificación del cliente en vuelo
      const previousOrder: Pedido = JSON.parse(previousOrderRaw);
      const consolidatedOrderLines = consolidateOrderLines(data.lineasPedido);
      const updatedPreviousOrder = rebuildOrderWithConsolidatedLines(previousOrder, consolidatedOrderLines);

      updatedPreviousOrder.idPedido = data.idPedido;
      updatedPreviousOrder.estado = data.estado;
      updatedPreviousOrder.observaciones = data.observaciones;

      const lineasAModificar = getConsolidatedLinesToModify(consolidatedOrderLines);
      if (lineasAModificar.length > 0) {
        sendEvent("modifyOrder", {
          orderId: order.idPedido,
          lineNumbers: lineasAModificar.map(lp => lp.nroLinea),
          data: { items: lineasAModificar.map(lp => ({ cantidad: lp.cantidad })) }
        });
      }

      const lineasAEliminar = getLinesToDelete(data.lineasPedido, consolidatedOrderLines);
      lineasAEliminar.forEach(nroLinea => {
        sendEvent("deleteOrderLine", { orderId: order.idPedido, lineNumber: nroLinea });
      });

      handleRecoveryCurrentState({ updatedPreviousOrder });
      toast.info('La cocina ha actualizado su pedido, no se aplicó su modificación');
      localStorage.removeItem('previousOrder');
      localStorage.removeItem('modification');
      navigate(`/Cliente/Menu/PedidoConfirmado/`);
    };

    // Siempre registra, la lógica de qué hacer se decide adentro del handler
    onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);

    return () => {
      offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
    };
  }, []);
};

