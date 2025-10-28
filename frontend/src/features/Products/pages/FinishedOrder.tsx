
import { useAppSelector } from "../../../shared/hooks/store"
import { OrderTotalAmount } from "../utils/OrderTotalAmount"
import { useNavigate } from "react-router"
import { PaymentConfirmationModal } from "../../Order/components/GoToPaymentConfirmationModal"
import { StatusIndicator } from "../../Order/components/StatusIndicator"
import { useWebSocket } from "../../../shared/hooks/useWebSocket"
import { useEffect, useRef } from "react"
import { useOrderActions } from "../../../shared/hooks/useOrderActions"
import type { OrderClientInfo, OrderStatus, Pedido } from "../../Order/interfaces/Order"
import { formatCurrency } from "../../../shared/utils/formatCurrency"
import { consolidateOrderLines } from "../../Order/utils/consolidateOrderLines";
import { rebuildOrderWithConsolidatedLines } from "../../Order/utils/rebuildOrderWithConsolidatedLines";
import { getConsolidatedLinesToModify } from "../../Order/utils/getConsolidatedLinesToModify";
import { getLinesToDelete } from "../../Order/utils/getLinesToDelete";
import { toast } from "react-toastify";
import { determineAmountModificationProductLines } from "../../Order/utils/determineAmountModificationProductLines"
import useApiClient from "../../../shared/hooks/useApiClient"
import { requestProductInfo } from "../../Order/services/requestProductInfo"
import type { Bebida, Comida } from "../interfaces/products"

/*
export interface OrderLineClientInfo {
    nombreProducto: string,
    tipo: FoodType | null,
    cantidad: number,
    estado: string,
    nroLinea?: number
}

export interface OrderClientInfo {
    idPedido: number
    lineasPedido: OrderLineClientInfo[],
    estado: OrderStatus,
    observaciones: string
}

export type LineaPedido = {
    producto: Comida | Bebida,
    cantidad: number,
    estado: OrderLineStatus,
    subtotal: number;
    lineNumber?: number;
    tipo?: string;
    esAlcoholica?: boolean
}

export type Pedido = {
    idPedido: number,
    lineasPedido: LineaPedido[],
    estado: OrderStatus,
    observaciones: string,
    comensales: number
}

*/

export default function FinishedOrder() {
    const order = useAppSelector((state) => state.order)
    const { handleAddToCart, hanldeRemoveFromCart, handleModifyObservation, handleModifyCutleryAmount, handleModifyOrderStatus, handleRecoveryCurrentState } = useOrderActions()
    const navigate = useNavigate()
    const { onEvent, offEvent, sendEvent } = useWebSocket();
    const { apiCall } = useApiClient();

    const handleStatusChangeRef = useRef<(data: OrderClientInfo) => void>(() => {});
    const orderStatusRef = useRef<OrderStatus>(order.estado);
    
    useEffect(() => {
        const handleOrderUpdate = (data: OrderClientInfo) => {
            console.log('📨 Actualización de modificación recibida:', data);
            handleStatusChangeRef.current(data);

            // Evaluamos lineas modificadas
            const productosModificados = determineAmountModificationProductLines(data.lineasPedido, order.lineasPedido)
            
            productosModificados.forEach(lpToModify => {
                if(lpToModify.diferencia > 0) { //Cantidad a agregar
                    for (let index = 0; index < lpToModify.diferencia; index++) {
                        handleAddToCart(lpToModify.producto.producto)
                    }
                } else if (lpToModify.diferencia < 0) { // Cantidad a eliminar
                    for (let index = 0; index < lpToModify.diferencia; index++) {
                        hanldeRemoveFromCart({ nombreProducto: lpToModify.producto.producto._name })
                    }
                }
            })

            //Evaluamos modificación de observación
            if(data.observaciones !== order.observaciones) {
                handleModifyObservation(data.observaciones)
            }

            //Evaluamos modificación de cantidad de cubiertos
            if(data.comensales !== order.comensales) {
                handleModifyCutleryAmount(data.comensales)
            }

            toast.info('El mozo ha modificado su pedido')
        };

        const handleOrderAdd = async (data: OrderClientInfo) => {
            console.log('📨 Actualización de add recibida:', data);
            handleStatusChangeRef.current(data);
            
            //Evaluamos los nuevos productos
            const lineasPendientesActuales = data.lineasPedido.filter(lp => lp.estado === 'Pendiente')

            // Filtrar las que NO existían en el pedido previo
            const productosAdicionales = lineasPendientesActuales.filter(lp => {
                const isValid = order.lineasPedido.find(existingLp => 
                    existingLp.producto._name === lp.nombreProducto && 
                    existingLp.estado === 'Pendiente'
                )
                if(!isValid) return true
                else return false
            });

            //Service para obtener la data
            try {
                const productosPromises = productosAdicionales.map(nuevoProducto => 
                    requestProductInfo(apiCall, nuevoProducto.nombreProducto)
                )
                const productosData: (Comida | Bebida)[] = await Promise.all(productosPromises)

                productosData.forEach(dataProducto => {
                    handleAddToCart(dataProducto)
                })
            } catch (error) {
                console.error('Error al obtener productos:', error)
                toast.error('Error al agregar algunos productos')
            }

            toast.info('El mozo ha añadido nuevas lineas a su pedido')
        };

        const handleOrderDelete = (data: OrderClientInfo) => {
            console.log('📨 Actualización de delete recibida:', data);
            handleStatusChangeRef.current(data);

            //Evaluamos los nuevos productos a borrar
            const lineasPosiblesAEliminar = order.lineasPedido.filter(lp => lp.estado === 'Pendiente')

            const productoAEliminar = lineasPosiblesAEliminar.filter(lp => {
                const existsInServer = data.lineasPedido.filter(lp => lp.estado === 'Pendiente').find(serverLp => 
                    serverLp.nombreProducto === lp.producto._name
                );
                return !existsInServer;
            });

            productoAEliminar.forEach(lpAEliminar => {
                hanldeRemoveFromCart({ nombreProducto: lpAEliminar.producto._name })
            })

            toast.info('El mozo ha eliminado lineas de su pedido')
        };

        const handleOrderUpdateByKitchen = (data: OrderClientInfo) => { 
            console.log('📨 Data recibida:', data);
            console.log('📨 lineasPedido:', data.lineasPedido); // Ver estructura exacta
            
            const previousOrder: Pedido = JSON.parse(localStorage.getItem('order')!);
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
            toast.info('La cocina ha actualizado su pedido, no se aplicó su modificación');
        };
  
        // Mismos eventos que FinishedOrder
        onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
        onEvent("addedOrderLine", handleOrderAdd);
        onEvent("deletedOrderLine", handleOrderDelete);
        onEvent("modifiedOrderLine", handleOrderUpdate);

        return () => {
            offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
            offEvent("addedOrderLine", handleOrderAdd);
            offEvent("deletedOrderLine", handleOrderDelete);
            offEvent("modifiedOrderLine", handleOrderUpdate);
        };
    }, []);

    // Sincronizar ref cuando Redux cambie
    useEffect(() => {
        orderStatusRef.current = order.estado;
    }, [order.estado]); //   Se actualiza cuando Redux cambia

    //   Actualizar el ref si las dependencias cambian
    useEffect(() => {
        handleStatusChangeRef.current = (data: OrderClientInfo) => {
            console.log('📨 Data recibida del WebSocket:', data);
            handleModifyOrderStatus({newOrderStatus: data.estado, orderLinesData: data.lineasPedido});
        };
    }, [handleModifyOrderStatus]);
    

    const handleModify = () => {
        localStorage.setItem("previousOrder", JSON.stringify(order))
        navigate('/Cliente/Menu/ModificarPedido/')
    }

    const handleGoToPayment = () => {
        window.dispatchEvent(new CustomEvent('openPaymentConfirmationModal'))
    }

    return (
        <div className="flex flex-col justify-center w-full">
            <StatusIndicator currentStatus={ order.estado }></StatusIndicator>
            <section className="flex flex-col w-full items-center h-auto mb-10">
                <div 
                    className="md:border flex flex-col py-4 md:border-gray-300 md:shadow-2xl 
                    w-full max-w-3xl md:rounded-2xl"
                >
                    <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0 mx-5 mb-3 md:items-center">
                        <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Mi Pedido</h1>
                        <div className="flex gap-1 md:gap-2">
                            <span className="text-gray-800 font-bold text-lg md:text-2xl">Total:</span>
                            <span className="text-orange-500 font-bold text-lg md:text-2xl">{formatCurrency(OrderTotalAmount(order.lineasPedido), 'es-AR', 'ARS')}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-3">
                        {order.lineasPedido.map((lp) => (
                            <div
                                key={lp.producto._name}
                                className="flex flex-col gap-2 border border-gray-300 rounded-xl shadow-sm p-3"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col max-w-[200px]">
                                        <span className="font-semibold">{lp.producto._name}</span>
                                        <span className="text-sm text-gray-600 pr-1">{lp.producto._name}</span>
                                        <span className="text-orange-600 font-bold">{formatCurrency(lp.subtotal, 'es-AR', 'ARS')}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">Cant: {lp.cantidad}</p>
                                        <p className="text-sm font-bold">Precio: {formatCurrency(lp.producto._price * lp.cantidad, 'es-AR', 'ARS')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-row gap-2 justify-between">
                            <label className="font-bold text-gray-700">
                                Cantidad de comensales: 
                            </label>
                            <span className="text-gray-900 font-bold">{order.comensales}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-gray-700">Observaciones: </label>
                            <span className="text-gray-900 italic p-2 bg-gray-100 rounded-lg border border-gray-200 min-h-[40px]">
                                {order.observaciones || 'Sin observaciones.'}
                            </span> 
                        </div>

                        <div className="flex justify-between mt-4">
                            <button 
                                className="active:bg-orange-700 hover:scale-105 relative transition-all 
                                ease-linear duration-100 active:scale-95 m-auto py-2 px-4 bg-orange-500 
                                rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
                                onClick={handleModify}
                            >
                                Modificar Pedido
                            </button>
                            <button 
                                className={`m-auto py-2 px-4 rounded-lg shadow-lg text-white font-bold transition-all
                                    ${order.estado === 'Completado' 
                                        ? 'bg-orange-500 cursor-pointer hover:bg-orange-600 active:bg-orange-700 hover:scale-105 active:scale-95' 
                                        : 'm-auto py-2 px-4 bg-gray-400 rounded-lg shadow-lg text-gray-300 font-bold cursor-not-allowed opacity-50'
                                    }`
                                }
                                onClick={handleGoToPayment}
                                disabled={order.estado !== 'Completado'}
                            >
                                Pagar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <PaymentConfirmationModal/>

        </div>
    )
}