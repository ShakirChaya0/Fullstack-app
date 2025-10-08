import type { KitchenOrder } from "../interfaces/KitchenOrder";
import type { OrderLineStatus } from "../types/SharedTypes";
import OrderLineItem from "./OrderLineItem";

type OrderDetailModalProps = {
    order: KitchenOrder | null,
    onClose: () => void,
    onUpdateLineStatus: (orderId: number, lineIndex: number, newStatus: OrderLineStatus) => void
}

export default function OrderDetailModal({ order, onClose, onUpdateLineStatus }: OrderDetailModalProps) {
    if (!order) return null;

    const groupedLines = order.lineasPedido.reduce<Record<string, typeof order.lineasPedido>>((acc, line) => {
        const type = line.tipoComida || 'Otros';
        if (!acc[type]) acc[type] = [];
        acc[type].push(line);
        return acc;
    }, {});
    
    const typeOrder = ['Entrada', 'Plato_Principal', 'Postre', 'Bebida', 'Otros'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#F5F5F5] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col transform transition-all duration-300 scale-95 animate-modal-in">
                <header className="flex items-center justify-between p-4 border-b border-[#E0E0E0] bg-[#FFFFFF] rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-[#1D1F21]">Pedido #{order.idPedido}</h2>
                    <button onClick={onClose} className="text-[#B0B0B0] hover:text-[#FF6600] transition-colors text-3xl font-light">&times;</button>
                </header>

                {order.observaciones && (
                    <div className="p-4 bg-[#FFEFE5] border-b border-[#FF983F]">
                        <p className="font-semibold text-[#FF6600]"><span className="font-bold">⚠️ Observaciones:</span> {order.observaciones}</p>
                    </div>
                )}

                <main className="flex-grow p-4 overflow-y-auto">
                    {typeOrder.map(type => 
                        groupedLines[type] && (
                            <div key={type} className="mb-4">
                                <h3 className="text-lg font-semibold text-[#115E59] mb-2 border-b border-[#CCCCCC] pb-1">{type.replace('_', ' ')}</h3>
                                {groupedLines[type].map((line, index) => (
                                    <OrderLineItem
                                        key={`${line.nombreProducto}-${index}`}
                                        line={line}
                                        orderId={order.idPedido}
                                        lineIndex={order.lineasPedido.findIndex(originalLine => originalLine === line)}
                                        onUpdateStatus={onUpdateLineStatus}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </main>
            </div>
            <style>{`
                @keyframes modal-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-modal-in { animation: modal-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};