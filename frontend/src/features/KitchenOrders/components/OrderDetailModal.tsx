import { Fade, Modal } from "@mui/material";
import type { KitchenOrder } from "../interfaces/KitchenOrder";
import type { OrderLineStatus } from "../types/SharedTypes";
import OrderLineItem from "./OrderLineItem";

type OrderDetailModalProps = {
    order: KitchenOrder | null,
    onClose: () => void,
    onUpdateLineStatus: (orderId: number, lineNumber: number, newStatus: OrderLineStatus) => void
}

export default function OrderDetailModal({ order, onClose, onUpdateLineStatus }: OrderDetailModalProps) {
    if (!order) return null;

    console.log('Rendering OrderDetailModal for Order ID:', order);

    const groupedLines = order.lineasPedido.reduce<Record<string, typeof order.lineasPedido>>((acc, line) => {
        const type = line.tipoComida || 'Otros';
        if (!acc[type]) acc[type] = [];
        acc[type].push(line);
        return acc;
    }, {});
    
    const typeOrder = ['Entrada', 'Plato_Principal', 'Postre', 'Bebida', 'Otros'];

    return (
        <Modal
            open={!!order}
            onClose={onClose}
            closeAfterTransition
            aria-labelledby="order-details-title"
            aria-describedby="order-details-description"            
            className="flex items-center justify-center p-4"
        >
            <Fade in={!!order}>
                <div className="bg-[#F5F5F5] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col outline-none">
                    <header className="flex items-center justify-between p-4 border-b border-[#E0E0E0] bg-[#FFFFFF] rounded-t-2xl">
                        <h2 id="order-details-title" className="text-2xl font-bold text-[#1D1F21]">Pedido #{order.idPedido}</h2>
                        <button onClick={onClose} className="cursor-pointer text-[#B0B0B0] hover:text-[#FF6600] transition-colors text-3xl font-light">&times;</button>
                    </header>

                    {order.observaciones && (
                        <div className="p-4 bg-[#FFEFE5] border-b border-[#FF983F]">
                            <p className="font-semibold text-[#FF6600]"><span className="font-bold">⚠️ Observaciones:</span> {order.observaciones}</p>
                        </div>
                    )}

                    <main id="order-details-description" className="flex-grow p-4 overflow-y-auto">
                        {typeOrder.map(type => 
                            groupedLines[type] && (
                                <div key={type} className="mb-4">
                                    <h3 className="text-lg font-semibold text-[#115E59] mb-2 border-b border-[#CCCCCC] pb-1 capitalize">{type.replace('_', ' ')}</h3>
                                    {groupedLines[type].map((line, index) => (
                                        <OrderLineItem
                                            key={`${line.nombreProducto}-${index}`}
                                            line={line}
                                            orderId={order.idPedido}
                                            onUpdateStatus={onUpdateLineStatus}
                                        />
                                    ))}
                                </div>
                            )
                        )}
                    </main>
                </div>
            </Fade>
        </Modal>
    );
};