
import { useAppSelector } from "../../../shared/hooks/store"
import { OrderTotalAmount } from "../utils/OrderTotalAmount"
import { useNavigate } from "react-router"
import { PaymentConfirmationModal } from "../../Schedules/components/GoToPaymentConfirmationModal"
import { StatusIndicator } from "../../Order/components/StatusIndicator"
import { useWebSocket } from "../../../shared/hooks/useWebSocket"
import { useEffect, useRef, useState } from "react"
import { useOrderActions } from "../../../shared/hooks/useOrderActions"
import type { OrderStatus } from "../../Order/interfaces/Order"

interface OrderLineClientInfo {
    nombreProducto: string,
    cantidad: number,
    estado: string,
}

export interface OrderClientInfo {
    idPedido: number
    lineasPedido: OrderLineClientInfo[],
    estado: OrderStatus,
    observaciones: string
}

export default function FinishedOrder() {
    const order = useAppSelector((state) => state.order)
    const { handleModifyOrderStatus } = useOrderActions()
    const navigate = useNavigate()
    const { onEvent, offEvent } = useWebSocket();
    const [state, setState] = useState<OrderStatus>('Solicitado')


    const handleStatusChangeRef = useRef((data: OrderClientInfo) => {
        console.log('📨 Data recibida del WebSocket:', data);
        setState(data.estado);
        handleModifyOrderStatus(data.estado);
    });

    // ✅ Actualizar el ref si las dependencias cambian
    useEffect(() => {
        handleStatusChangeRef.current = (data: OrderClientInfo) => {
            console.log('📨 Data recibida del WebSocket:', data);
            setState(data.estado);
            handleModifyOrderStatus(data.estado);
        };
    }, [handleModifyOrderStatus]);

    // ✅ Efecto separado para listeners - se ejecuta UNA SOLA VEZ
    useEffect(() => {
        console.log('🎯 Configurando listener para updatedOrderLineStatus');

        const handler = (data: OrderClientInfo) => {
            handleStatusChangeRef.current(data);
        };

        onEvent("updatedOrderLineStatus", handler);

        return () => {
            console.log('🧹 Limpiando listener updatedOrderLineStatus');
            offEvent("updatedOrderLineStatus", handler);
        };
    }, []); 

    const handleModify = () => {
        localStorage.setItem("previousOrder", JSON.stringify(order))
        navigate('/Cliente/Menu/RealizarPedido/')
    }

    const handleGoToPayment = () => {
        window.dispatchEvent(new CustomEvent('openPaymentConfirmationModal'))
    }

    // const handleClick = () => {
    //     console.log("Emitiendo evento...");
    //     sendEvent("updateLineStatus", {idPedido: 105, nroLinea: 1, estadoLP: 'Terminada'});
    // }; Boton de prueba para emitir la orden

    return (
        <div className="flex flex-col justify-center w-full">
            <div>
                    {/* 
                <button 
                    className="active:bg-orange-700 hover:scale-105 relative transition-all 
                    ease-linear duration-100 active:scale-95 m-auto py-2 px-4 bg-orange-500 
                    rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
                    onClick={handleClick}
                >
                    Emitir 
                </button>  Boton de prueba para emitir la orden*/}
            </div>
            <StatusIndicator currentStatus={ state }></StatusIndicator>
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