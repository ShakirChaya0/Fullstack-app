import DrinksLink from "../components/drinks/drinksLink";
import FoodsLink from "../components/foods/foodsLink";
import { OrderList } from "../components/orderList";
import { useNavigate, useSearchParams } from "react-router";
import fetchQR from "../services/fetchQR";
import useApiClient from "../../../shared/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import WaitingForQR from "../components/WaitingForQR";
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

export default function Menu(){
    const [searchParams, setSearchParams] = useSearchParams()
    const { apiCall } = useApiClient()
    const qrToken = searchParams?.get("qrToken");
    const mesa = searchParams?.get("mesa");
    const hasQrParams = (qrToken ? true : false) && (mesa ? true : false);
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

    const { isLoading, isError } = useQuery({
        queryKey: ['qr'],
        queryFn: () =>  fetchQR(apiCall, searchParams.get("qrToken")!, Number(searchParams.get("mesa"))),
        enabled: hasQrParams,
        staleTime: Infinity,
        retry: 0,
        refetchOnMount: false
    })

    return(
        <>
            {!isLoading && !isError &&
                <div className="flex flex-1 flex-col justify-center items-center gap-5">
                    <FoodsLink/>
                    <DrinksLink/>
                    <OrderList/>
                </div>
            }
            {isError && hasQrParams && 
                <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-gray-50 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-center mx-auto my-4 sm:my-10">
        
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Escanear Código QR</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-2">Asegurate de solicitarle el QR al mozo</p>

                    <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
                        <div id="error-message" className="bg-red-50 border-l-4 border-red-500 text-red-800 p-3 sm:p-4 rounded-lg text-left flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6" role="alert">
                            <div>
                                <p className="font-bold text-sm sm:text-base">¡QR no reconocido!</p>
                                <p className="text-xs sm:text-sm">No pudimos leer el código. Asegúrate de que esté bien iluminado y vuelve a intentarlo.</p>
                            </div>
                        </div>

                        <WaitingForQR/>
                    </div>

                </div>
            }   
        </>
    ) 
}