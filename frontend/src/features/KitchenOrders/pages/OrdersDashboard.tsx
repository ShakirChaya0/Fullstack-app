import { useCallback, useState } from 'react';
import { initialOrders } from '../styles/statusColors';
import OrderDetailModal from '../components/OrderDetailModal';
import OrderCard from '../components/OrderCard';
import type { KitchenOrder } from '../interfaces/KitchenOrder';
import type { OrderLineStatus } from '../types/SharedTypes';

export default function OrdersDashboard() {
    const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);

    const activeOrders = orders.filter(o => o.estado === 'Solicitado' || o.estado === 'En_Preparacion');
    
    activeOrders.sort((a, b) => new Date(a.horaInicio).getTime() - new Date(b.horaInicio).getTime());

    const handleSelectOrder = useCallback((order: KitchenOrder) => {
        setSelectedOrder(order);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedOrder(null);
    }, []);

    const handleUpdateLineStatus = (orderId: number, lineIndex: number, newStatus: OrderLineStatus) => {
        setOrders(prevOrders => {
            const newOrders = prevOrders.map(order => {
                if (order.idPedido === orderId) {
                    const updatedLines = [...order.lineasPedido];
                    updatedLines[lineIndex].estado = newStatus;
                    
                    const allFinished = updatedLines.every(l => l.estado === 'Terminada');
                    const anyInProgress = updatedLines.some(l => l.estado === 'En_Preparacion');
                    let newOrderStatus = order.estado;

                    if (allFinished) {
                        newOrderStatus = 'Completado'; 
                    } else if (anyInProgress || updatedLines.some(l => l.estado === 'Terminada')) {
                        newOrderStatus = 'En_Preparacion';
                    } else {
                        newOrderStatus = 'Solicitado';
                    }

                    return { ...order, lineasPedido: updatedLines, estado: newOrderStatus };
                }
                return order;
            });
            
            if (selectedOrder && selectedOrder.idPedido === orderId) {
                const updatedSelectedOrder = newOrders.find(o => o.idPedido === orderId);
                setSelectedOrder(updatedSelectedOrder!);
            }

            return newOrders;
        });
    };

    return (
        <section className="w-full bg-[#F5F5F5] min-h-screen font-sans">
            <div className="bg-[#FFFFFF] shadow-md p-4">
                <h1 className="text-3xl font-bold text-center text-[#1D1F21]">Panel de Cocina</h1>
            </div>
            
            <div className="p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {activeOrders.length > 0 ? (
                        activeOrders.map(order => (
                            <OrderCard key={order.idPedido} order={order} onSelect={handleSelectOrder} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-[#FFFFFF] rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-semibold text-[#6B6B6B]">¡Todo listo por aquí!</h2>
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

