import { lazy, Suspense, useMemo, useState } from "react"
import { useDrinks } from "../hooks/useDrinks"
import FilterDrinks from "../components/drinks/filterDrinks"
import SkeletonBody from "./skeletonBody"
import { OrderList } from "../components/orderList"
import SuggestionsList from "../components/SuggestionsList"
import SuggestionSkeleton from "../components/SuggestionSkeleton"
import { Alert } from "@mui/material"
const FilteredDrinks = lazy(() => import("../components/drinks/FilteredDrinks"))
import { useEffect } from "react";
import type { OrderClientInfo, Pedido } from "../../Order/interfaces/Order";
import { consolidateOrderLines } from "../../Order/utils/consolidateOrderLines";
import { rebuildOrderWithConsolidatedLines } from "../../Order/utils/rebuildOrderWithConsolidatedLines";
import { getConsolidatedLinesToModify } from "../../Order/utils/getConsolidatedLinesToModify";
import { getLinesToDelete } from "../../Order/utils/getLinesToDelete";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../shared/hooks/store";
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import { useWebSocket } from "../../../shared/hooks/useWebSocket";
import { useNavigate } from "react-router"

function DrinksList() {
  const { isLoading, isError, drinks } = useDrinks()
  const [query, setQuery] = useState("")
  const modication = localStorage.getItem('modification');
  const navigate = useNavigate();
  const order = useAppSelector((state) => state.order);
  const { handleRecoveryCurrentState } = useOrderActions();
  const { onEvent, offEvent, sendEvent } = useWebSocket();
  
  if (modication === 'true') {
    useEffect(() => {
        const handleOrderUpdateByKitchen = (data: OrderClientInfo) => {
            console.log('📨 Data recibida:', data);
            console.log('📨 lineasPedido:', data.lineasPedido); // Ver estructura exacta
            
            const previousOrder: Pedido = JSON.parse(localStorage.getItem('previousOrder')!);
            const consolidatedOrderLines = consolidateOrderLines(data.lineasPedido);
            
            console.log('📊 Consolidadas:', consolidatedOrderLines); // Ver qué se consolida
            
            // Verificar estados antes de reconstruir
            consolidatedOrderLines.forEach(line => {
                console.log(`Línea ${line.nroLinea}: ${line.nombreProducto} - Estado: "${line.estado}" - Cantidad: ${line.cantidad}`);
            });
            
            const updatedPreviousOrder = rebuildOrderWithConsolidatedLines(
                previousOrder,
                consolidatedOrderLines
            );
            
            console.log('📋 updatedPreviousOrder.lineasPedido:', updatedPreviousOrder.lineasPedido); // Ver líneas finales
            
                    
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
            toast.warning('La cocina ha actualizado su pedido, no se aplicó su modificación');
            
            localStorage.removeItem('previousOrder');
            localStorage.removeItem('modification');
            navigate(`/Cliente/Menu/PedidoConfirmado/`);
        };
    
        // Mismos eventos que FinishedOrder
        onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);

        return () => {
            offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
        };
    }, []);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value)
  }

  const filteredDrinks = useMemo(() => {
    return (
      drinks?.filter((dat) =>
        dat._name.toLowerCase().includes(query.toLowerCase())
      ) ?? []
    )
  }, [drinks, query])

  return (
    <>
      <section className="flex-1 md:p-4 pb-6 w-full h-full overflow-y-auto">
        <div className="border border-gray-300 rounded-2xl p-4 w-full min-w-2 shadow-2xl">
          {!isError && <FilterDrinks handleChange={handleChange} />}
          <Suspense fallback={<SuggestionSkeleton/>}>
            <SuggestionsList/>
          </Suspense>
          {isError && (
            <Alert
              severity="error"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                margin: '2rem 2rem 0.5rem 2rem'
              }}
            >
              Error al cargar los datos del menú
            </Alert>
          )}
          {filteredDrinks.length === 0 && query.length !== 0 && !isError && (
            <Alert
              severity="error"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                margin: '2rem 2rem 0.5rem 2rem'
              }}
            >
              No se ha encontrado dicho plato
            </Alert>
          )}

          {!isLoading ? (
            <Suspense fallback={<SkeletonBody/>}>
              <FilteredDrinks filteredDrinks={filteredDrinks} />
            </Suspense>
          ) : (
            <SkeletonBody />
          )}
        </div>
        <OrderList />
      </section>
    </>
  )
}

export default DrinksList;