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
    // Verificar si estamos en modo modificación
    const isModifying = localStorage.getItem('modification') === 'true';

    if (!isModifying) return;

    const handleOrderUpdateByKitchen = (data: OrderClientInfo) => {
      console.log('📨 Data recibida:', data);
      console.log('📨 lineasPedido:', data.lineasPedido);

      const previousOrder: Pedido = JSON.parse(
        localStorage.getItem('previousOrder')!
      );
      const consolidatedOrderLines = consolidateOrderLines(data.lineasPedido);

      console.log('📊 Consolidadas:', consolidatedOrderLines);

      consolidatedOrderLines.forEach(line => {
        console.log(`Línea ${line.nroLinea}: ${line.nombreProducto} - Estado: "${line.estado}" - Cantidad: ${line.cantidad}`);
      });

      const updatedPreviousOrder = rebuildOrderWithConsolidatedLines(
        previousOrder,
        consolidatedOrderLines
      );

      console.log('📋 updatedPreviousOrder.lineasPedido:', updatedPreviousOrder.lineasPedido);

      updatedPreviousOrder.idPedido = data.idPedido;
      updatedPreviousOrder.estado = data.estado;
      updatedPreviousOrder.observaciones = data.observaciones;

      // Emits: solo Pendiente y Completada
      const lineasAModificar = getConsolidatedLinesToModify(consolidatedOrderLines);
      if (lineasAModificar.length > 0) {
        sendEvent("modifyOrder", {
          orderId: order.idPedido,
          lineNumbers: lineasAModificar.map(lp => lp.nroLinea),
          data: {
            items: lineasAModificar.map(lp => ({ cantidad: lp.cantidad }))
          }
        });
      }

      // Líneas duplicadas a eliminar de la BD
      const lineasAEliminar = getLinesToDelete(data.lineasPedido, consolidatedOrderLines);
      lineasAEliminar.forEach(nroLinea => {
        sendEvent("deleteOrderLine", {
          orderId: order.idPedido,
          lineNumber: nroLinea
        });
      });

      handleRecoveryCurrentState({ updatedPreviousOrder });
      toast.info('La cocina ha actualizado su pedido, no se aplicó su modificación');

      localStorage.removeItem('previousOrder');
      localStorage.removeItem('modification');
      navigate('/Cliente/Menu/PedidoConfirmado/');
    };

    onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);

    return () => {
      offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
    };
  }, []);
};

