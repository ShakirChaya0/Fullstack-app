import { useEffect, useState } from "react";
import { statusColors } from "../styles/statusColors";
import type { KitchenOrder } from "../interfaces/KitchenOrder";

type OrderCardProps = {
    order: KitchenOrder,
    onSelect: (order: KitchenOrder) => void
}

export default function OrderCard({ order, onSelect }: OrderCardProps) {
    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(order.horaInicio);
            const now = new Date();
            const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            setElapsedTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [order.horaInicio]);

    const totalLines = order.lineasPedido.length;
    const completedLines = order.lineasPedido.filter(l => l.estado === 'Terminada').length;
    const progress = totalLines > 0 ? (completedLines / totalLines) * 100 : 0;
    
    const minutesElapsed = Math.floor((new Date().getTime() - new Date(order.horaInicio).getTime()) / 60000);
    let timerColorClass = 'bg-[#E6F4F3] text-[#0F766E]'; // Verde Teal Tint
    if (minutesElapsed >= 10) {
        timerColorClass = 'bg-[#FF6600] text-white animate-pulse'; // Naranja Principal
    } else if (minutesElapsed >= 5) {
        timerColorClass = 'bg-[#FFEFE5] text-[#FF6600]'; // Naranja Tint
    }

    return (
        <div 
            onClick={() => onSelect(order)}
            className="bg-[#FFFFFF] rounded-2xl shadow-lg p-5 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-[#0F766E]"
        >
            <header className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-[#1D1F21]">Pedido #{order.idPedido}</h3>
                <span className={`px-3 py-1 text-lg font-mono rounded-full ${timerColorClass}`}>
                    {elapsedTime}
                </span>
            </header>
            
            <div className="flex-grow space-y-2 mb-4 border-t border-b border-[#E0E0E0] py-3 max-h-[150px] overflow-y-auto">
                {order.lineasPedido.map((line, index) => (
                    <div key={index} className="flex items-center text-[#444648]">
                         <span className={`font-semibold mr-2 text-sm ${statusColors[line.estado].text}`}>{line.cantidad}x</span>
                         <span className="text-sm">{line.nombreProducto}</span>
                    </div>
                ))}
            </div>

            {order.observaciones && (
                <p className="text-sm text-[#FF6600] bg-[#FFEFE5] p-2 rounded-md mb-4">⚠️ Con observaciones</p>
            )}

            <footer className="w-full mt-auto">
                <div className="flex justify-between text-sm text-[#6B6B6B] mb-1">
                    <span>Progreso</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-[#E0E0E0] rounded-full h-2.5">
                    <div className="bg-[#0F766E] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </footer>
        </div>
    );
};