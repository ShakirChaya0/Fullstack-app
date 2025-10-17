import { useCallback, useEffect, useMemo, useState } from 'react';
import OrderDetailModal from '../components/OrderDetailModal';
import OrderCard from '../components/OrderCard';
import type { KitchenOrder } from '../interfaces/KitchenOrder';
import type { OrderLineStatus } from '../types/SharedTypes';
import { useWebSocket } from '../../../shared/hooks/useWebSocket';
import { toast } from 'react-toastify';
import parseTimeToTimestamp from '../../../shared/utils/parseTimeToTimestamp';

export default function OrdersDashboard() {
    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
    const { connected, connecting, sendEvent, onEvent, offEvent } = useWebSocket();

    const handleUpdatedOrder = useCallback((updatedOrder: KitchenOrder) => {
        setOrders(prev => prev.map(order => order.idPedido === updatedOrder.idPedido ? updatedOrder : order));
        setSelectedOrder(prev => prev && prev.idPedido === updatedOrder.idPedido ? updatedOrder : prev);
    }, []);

    useEffect(() => {
        const handleActiveOrders = (data: KitchenOrder[]) => {
            setOrders(data);
        };

        const handleNewOrder = (newOrder: KitchenOrder) => {
            setOrders(prevOrders => [...prevOrders, newOrder]);
            toast.info(`Nuevo pedido recibido: #${newOrder.idPedido}`);
        };

        onEvent("activeOrders", handleActiveOrders);

        onEvent("newOrder", handleNewOrder);

        onEvent("addedOrderLine", handleUpdatedOrder);

        onEvent("deletedOrderLine", handleUpdatedOrder);

        onEvent("modifiedOrderLine", handleUpdatedOrder);

        return () => {
            offEvent("activeOrders", handleActiveOrders);
            offEvent("newOrder", handleNewOrder);
            offEvent("addedOrderLine", handleUpdatedOrder);
            offEvent("deletedOrderLine", handleUpdatedOrder);
            offEvent("modifiedOrderLine", handleUpdatedOrder);
        };
    }, [onEvent, offEvent, handleUpdatedOrder]);

    const activeOrders = useMemo(() => orders.filter(order => order.estado !== 'Completado'), [orders]);
    const sortedOrders = useMemo(() => 
        activeOrders.sort((a, b) => 
            parseTimeToTimestamp(a.horaInicio) - parseTimeToTimestamp(b.horaInicio)
        ), 
    [activeOrders]);

    const handleSelectOrder = useCallback((order: KitchenOrder) => {
        setSelectedOrder(order);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedOrder(null);
    }, []);

    const handleUpdateLineStatus = useCallback((orderId: number, lineIndex: number, newStatus: OrderLineStatus) => {
        setOrders(prevOrders => {
            const newOrders = prevOrders.map(order => {
                if (order.idPedido === orderId) {
                    const updatedLines = [...order.lineasPedido];
                    updatedLines[lineIndex] = {
                        ...updatedLines[lineIndex],
                        estado: newStatus
                    };

                    const allFinished = updatedLines.every(l => l.estado === 'Terminada');
                    const anyInProgress = updatedLines.some(l => l.estado === 'En_Preparacion');
                    const anyFinished = updatedLines.some(l => l.estado === 'Terminada');

                    let newOrderStatus: KitchenOrder["estado"];
                    if (allFinished) newOrderStatus = 'Completado';
                    else if (anyInProgress || anyFinished) newOrderStatus = 'En_Preparacion';
                    else newOrderStatus = 'Solicitado';

                    return { ...order, lineasPedido: updatedLines, estado: newOrderStatus };
                }

                return order;
            });

            return newOrders;
        });

        setSelectedOrder(prev => prev && prev.idPedido === orderId ? {
                ...prev,
                lineasPedido: prev.lineasPedido.map((l, i) =>
                    i === lineIndex ? { ...l, estado: newStatus } : l
                ),
                estado: 
                    prev.lineasPedido.every(l => l.estado === 'Terminada') ? 'Completado'
                        : prev.lineasPedido.some(l => l.estado === 'En_Preparacion' || l.estado === 'Terminada') ? 'En_Preparacion'
                        : 'Solicitado'
                }
            : prev
        );

        sendEvent("updateLineStatus", { idPedido: orderId, nroLinea: lineIndex + 1, estadoLP: newStatus });
    }, [sendEvent]);

    if (connecting) {
        return (
            <section className="w-full bg-gray-100 min-h-screen font-sans flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 shadow-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Conectando al panel de cocina...</p>
                </div>
            </section>
        );
    }

    if (!connected)
        return (
            <section className="flex flex-col justify-center items-center w-full bg-gray-100 min-h-screen font-sans">
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-6 max-w-md text-center shadow-md">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="mb-4">No se pudo conectar al panel de pedidos activos. Por favor, intente nuevamente.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-md transition active:scale-95"
                    >
                        Reintentar
                    </button>
                </div>
            </section>
        );

    return (
        <section className="w-full bg-gray-100 min-h-screen font-sans">
            <div className="bg-white shadow-md p-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Panel de Cocina</h1>
            </div>
            
            <div className="p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {sortedOrders.length > 0 ? (
                        sortedOrders.map(order => (
                            <OrderCard key={order.idPedido} order={order} onSelect={handleSelectOrder} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white border-t-3 border-t-gray-200 rounded-2xl shadow-lg p-2">
                            <h2 className="text-2xl font-semibold text-[#6B6B6B]">¡Todo listo!</h2>
                            <p className="text-[#929292] mt-2">No hay pedidos activos en este momento.</p>
                        </div>
                    )}
                </div>
            </div>

            <OrderDetailModal
                order={selectedOrder}
                onClose={handleCloseModal}
                onUpdateLineStatus={handleUpdateLineStatus}
            />
        </section>
    );
}
