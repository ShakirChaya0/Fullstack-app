import { statusColors } from "../styles/statusColors";
import type { OrderLineStatus } from "../types/SharedTypes";

type OrderLineItemProps = {
    line: {
        nombreProducto: string,
        tipoComida?: string
        cantidad: number,
        estado: OrderLineStatus,
    },
    orderId: number,
    lineIndex: number,
    onUpdateStatus: (orderId: number, lineIndex: number, newStatus: OrderLineStatus) => void
}

export default function OrderLineItem({ line, orderId, lineIndex, onUpdateStatus }: OrderLineItemProps) {
    const { nombreProducto, cantidad, estado } = line;
    const colors = statusColors[estado];

    const statuses = ['Pendiente', 'En_Preparacion', 'Terminada'] as const;

    return (
        <div className={`flex items-center justify-between p-3 my-2 rounded-lg transition-all duration-300 ${colors.bg} border-l-4 ${colors.border}`}>
            <div className="flex-grow">
                <span className={`font-bold text-lg mr-2 ${colors.text}`}>{cantidad}x</span>
                <span className="text-[#444648] text-lg">{nombreProducto}</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
                {statuses.map(status => {
                    const statusColorHex: Record<typeof statuses[number], string> = {
                        Pendiente: '#6B6B6B',
                        En_Preparacion: '#FF6600',
                        Terminada: '#0F766E'
                    };
                
                    return (
                        <button
                            key={status}
                            onClick={() => onUpdateStatus(orderId, lineIndex, status)}
                            className={`
                                px-2 py-1 md:px-3 text-xs md:text-sm font-semibold rounded-md transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${statusColorHex[status]}]
                                ${estado === status
                                    ? `bg-[${statusColorHex[status]}] text-white shadow-md`
                                    : 'bg-[#FFFFFF] text-[#6B6B6B] hover:bg-[#F5F5F5] border border-[#CCCCCC]'
                                }
                            `}
                        >
                            {status === 'En_Preparacion' ? 'En Prep.' : status}
                        </button>
                    );
                })}
            </div>

        </div>
    );
};