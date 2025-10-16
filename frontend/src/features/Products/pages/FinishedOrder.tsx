
import { useAppSelector } from "../../../shared/hooks/store"
import { OrderTotalAmount } from "../utils/OrderTotalAmount"
import { useNavigate } from "react-router"
import { PaymentConfirmationModal } from "../../Order/components/GoToPaymentConfirmationModal"
import { StatusIndicator } from "../../Order/components/StatusIndicator"
import { useWebSocket } from "../../../shared/hooks/useWebSocket"
import { useEffect, useRef } from "react"
import { useOrderActions } from "../../../shared/hooks/useOrderActions"
import type { OrderClientInfo, OrderStatus } from "../../Order/interfaces/Order"


export default function FinishedOrder() {
    const order = useAppSelector((state) => state.order)
    const { handleModifyOrderStatus } = useOrderActions()
    const navigate = useNavigate()
    const { onEvent, offEvent, sendEvent} = useWebSocket();


    const handleStatusChangeRef = useRef<(data: OrderClientInfo) => void>(() => {});
    const orderStatusRef = useRef<OrderStatus>(order.estado);

    // Sincronizar ref cuando Redux cambie
    useEffect(() => {
        orderStatusRef.current = order.estado;
    }, [order.estado]); // ✅ Se actualiza cuando Redux cambia

    // ✅ Actualizar el ref si las dependencias cambian
    useEffect(() => {
        handleStatusChangeRef.current = (data: OrderClientInfo) => {
            console.log('📨 Data recibida del WebSocket:', data);
            handleModifyOrderStatus({newOrderStatus: data.estado, orderLinesData: data.lineasPedido});
            orderStatusRef.current = data.estado
        };
    }, [handleModifyOrderStatus]);

    // ✅ Efecto separado para listeners - se ejecuta UNA SOLA VEZ
    useEffect(() => {
        console.log('🎯 Configurando listeners para eventos de orden');

        // Handler único para todos los eventos ya que el backend siempre envía Order.toClientInfo()
        const handleOrderUpdate = (data: OrderClientInfo) => {
            console.log('📨 Evento de orden recibido:', data);
            handleStatusChangeRef.current(data);
        };

        // Registrar el mismo handler para todos los eventos que devuelven Order.toClientInfo()
        onEvent("updatedOrderLineStatus", handleOrderUpdate);
        onEvent("addedOrderLine", handleOrderUpdate);
        onEvent("deletedOrderLine", handleOrderUpdate);
        onEvent("modifiedOrderLine", handleOrderUpdate);

        return () => {
            console.log('🧹 Limpiando listeners de orden');
            offEvent("updatedOrderLineStatus", handleOrderUpdate);
            offEvent("addedOrderLine", handleOrderUpdate);
            offEvent("deletedOrderLine", handleOrderUpdate);
            offEvent("modifiedOrderLine", handleOrderUpdate);
        };
    }, []); 

    const handleModify = () => {
        localStorage.setItem("previousOrder", JSON.stringify(order))
        navigate('/Cliente/Menu/ModificarPedido/')
    }

    const handleGoToPayment = () => {
        window.dispatchEvent(new CustomEvent('openPaymentConfirmationModal'))
    }

    // Función Para hardcodear emisión de eventos de la cocina
    // const handleClick = () => {
    //     console.log("Emitiendo evento...");
    //     sendEvent("updateLineStatus", {idPedido: 152, nroLinea: 1, estadoLP: 'Terminada'});
    // }; 

    return (
        <div className="flex flex-col justify-center w-full">
            {/* <div>   BOTON Para hardcodear emisión de eventos de la cocina
                <button 
                    className="active:bg-orange-700 hover:scale-105 relative transition-all 
                    ease-linear duration-100 active:scale-95 m-auto py-2 px-4 bg-orange-500 
                    rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
                    onClick={handleClick}
                >
                    Emitir 
                </button> 
            </div> */}
            <StatusIndicator currentStatus={ order.estado }></StatusIndicator>
            <section className="flex flex-col w-full items-center h-auto mb-10">
                <div 
                    className="md:border flex flex-col py-4 md:border-gray-300 md:shadow-2xl 
                    w-full max-w-3xl md:rounded-2xl"
                >
                    <div className="flex flex-row justify-between mx-5 my-3">
                        <h1 className="text-2xl font-bold text-center text-gray-800">Mi Pedido</h1>
                        <div className="flex">
                            <span className="text-gray-800 font-bold text-2xl">Total:</span>
                            <span className="text-orange-500 font-bold text-2xl ml-1">${OrderTotalAmount(order.lineasPedido).toFixed(2)}</span>
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
                                        <span className="text-orange-600 font-bold">${lp.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">Cant: {lp.cantidad}</p>
                                        <p className="text-sm font-bold">Precio: ${(lp.producto._price * lp.cantidad).toFixed(2)}</p>
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