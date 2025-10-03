// src/components/ReservationCard.tsx
import React, { useState } from 'react';
import type { IReservation, StateReservation } from '../interfaces/IReservation';

interface ReservationCardProps {
  reservation: IReservation;
}

// Función auxiliar para obtener los estilos de Tailwind según el estado
const getStatusClasses = (status: StateReservation) => {
  switch (status) {
    case 'Asistida':
      return { 
        bg: 'bg-green-100 text-green-800', 
        border: 'border-green-500' 
      };
    case 'No_Asistida':
      return { 
        bg: 'bg-red-100 text-red-800', 
        border: 'border-red-500' 
      };
    case 'Realizada':
      return { 
        bg: 'bg-blue-100 text-blue-800', 
        border: 'border-blue-500' 
      };
    case 'Cancelada':
        return { 
            bg: 'bg-gray-100 text-gray-500', 
            border: 'border-gray-500' 
        };
    default:
      return { 
        bg: 'bg-gray-200 text-gray-800', 
        border: 'border-gray-400' 
      };
  }
};

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation: initialReservation }) => {
  // Usamos un estado local solo para simular el cambio visual inmediato
  const [reservation, setReservation] = useState(initialReservation);
  const { bg, border } = getStatusClasses(reservation._status);
  const isCancelled = reservation._status === 'Cancelada';

  const handleUpdateStatus = (newStatus: 'Asistida' | 'No_Asistida') => {
    if (isCancelled) {
        alert('Esta reserva ha sido cancelada.');
        return;
    }
    // Simulación: En un caso real, aquí llamarías a tu `useReservationMutation`
    console.log(`Simulando actualización de Reserva ${reservation._reserveId} a: ${newStatus}`);
    setReservation(prev => ({ ...prev, _status: newStatus }));
  };

  return (
    <div className={`p-4 bg-white rounded-xl shadow-md border-l-4 ${border} flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300`}>
      {/* Información */}
      <div className="flex-grow mb-4 md:mb-0">
        <h2 className={`text-xl font-semibold ${isCancelled ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {reservation._clientPublicInfo.nombre} {reservation._clientPublicInfo.apellido}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Hora:</span> {reservation._reserveTime} |
          <span className="font-medium ml-2">Comensales:</span> {reservation._commensalsNumber} |
          <span className="font-medium ml-2">Mesa(s):</span> {reservation._table.map(t => t._tableNum).join(', ')}
        </p>
        <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${bg}`}>
          Estado: {reservation._status.replace('_', ' ')}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex space-x-2 flex-shrink-0">
        <button
          onClick={() => handleUpdateStatus('Asistida')}
          disabled={isCancelled}
          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
          title="Marcar como Asistida"
        >
          Asistida 
        </button>

        <button
          onClick={() => handleUpdateStatus('No_Asistida')}
          disabled={isCancelled}
          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition disabled:opacity-50"
          title="Marcar como No Asistida"
        >
          No Asistida 
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;