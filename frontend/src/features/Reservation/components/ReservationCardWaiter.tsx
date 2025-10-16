import { useState } from 'react';
import type { IReservation } from '../interfaces/IReservation';
import { ConfirmModal } from './ModalConfirmReservation';
import { 
  getStatusClasses, 
  modalMessageAsistencia, 
  modalMessageNoAsistencia 
} from '../constants/constants';
import useReservationMutation from '../hooks/userReservationMutation';

interface ReservationCardProps {
  reservation: IReservation;
}

export function ReservationCard({ reservation: initialReservation }: ReservationCardProps) {
  const [reservation, setReservation] = useState(initialReservation);
  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'Asistida' | 'No_Asistida' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { bg, border } = getStatusClasses(reservation._status);
  const handleError = (message: string | null) => setErrorMessage(message);

  const { mutate } = useReservationMutation({ handleError });

  const handleConfirm = () => {
    if (!pendingStatus) return;

    mutate({
      _reservationId: reservation._reserveId,
      _reserveDate: new Date(reservation._reserveDate),
      _reserveTime: reservation._reserveTime,
      _commensalsNumber: reservation._commensalsNumber,
      _status: pendingStatus,
    });

    // Actualizamos visualmente la tarjeta
    setReservation((prev) => ({ ...prev, _status: pendingStatus }));
    setShowModal(false);
    setPendingStatus(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingStatus(null);
  };

  const openModal = (status: 'Asistida' | 'No_Asistida') => {
    if (reservation._status === 'Asistida' || reservation._status === 'No_Asistida') return;
    setPendingStatus(status);
    setShowModal(true);
  };

  // Bloquea los botones si la reserva ya tiene un estado final
  const isFinalState = 
    reservation._status === 'Asistida' || 
    reservation._status === 'No_Asistida' || 
    reservation._status === 'Cancelada';

  return (
    <div
      className={`p-4 bg-white rounded-xl shadow-md border-l-4 ${border} flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300`}
    >
      <div className="flex-grow mb-4 md:mb-0">
        <h2 className="text-xl font-semibold text-gray-800">
          {reservation._clientPublicInfo.nombre} {reservation._clientPublicInfo.apellido}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Hora:</span> {reservation._reserveTime} |
          <span className="font-medium ml-2">Comensales:</span> {reservation._commensalsNumber} |
          <span className="font-medium ml-2">Mesa(s):</span>{' '}
          {reservation._table.map((t) => t._tableNum).join(', ')}
        </p>
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${bg}`}
        >
          Estado: {reservation._status.replace('_', ' ')}
        </span>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>

      <div className="flex space-x-2 flex-shrink-0">
        <button
          onClick={() => openModal('Asistida')}
          disabled={isFinalState}
          className={`px-3 py-2 font-medium text-white rounded-lg shadow-md transition active:scale-95 ${
            reservation._status === 'Asistida'
            ? 'opacity-50 cursor-not-allowed bg-amber-200'
            : isFinalState
            ? 'opacity-50 cursor-not-allowed bg-amber-200'
            : 'cursor-pointer bg-amber-400 hover:bg-amber-600'
          }`}
          title="Marcar como Asistida"
        >
          Asistida
        </button>

        <button
          onClick={() => openModal('No_Asistida')}
          disabled={isFinalState}
          className={`px-3 py-2 text-sm font-medium text-white rounded-lg shadow-md transition active:scale-95 ${
            reservation._status === 'No_Asistida'
              ? 'opacity-50 cursor-not-allowed bg-gray-300'
              : isFinalState
              ? 'opacity-50 cursor-not-allowed bg-gray-300'
              : 'cursor-pointer bg-gray-400 hover:bg-gray-600'
          }`}
          title="Marcar como No Asistida"
        >
          No Asistida
        </button>
      </div>

      <ConfirmModal
        isOpen={showModal}
        title={
          pendingStatus === 'Asistida'
            ? 'Confirmar Asistencia'
            : 'Confirmar No Asistencia'
        }
        message={
          pendingStatus === 'Asistida'
            ? modalMessageAsistencia
            : modalMessageNoAsistencia
        }
        confirmLabel={
          pendingStatus === 'Asistida'
            ? 'Confirmar Asistencia'
            : 'Confirmar Inasistencia'
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
