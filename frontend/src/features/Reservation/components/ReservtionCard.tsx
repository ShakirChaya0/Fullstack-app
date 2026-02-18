import dateParser from "../../../shared/utils/dateParser";
import { formatStatus } from "../../../shared/utils/formatString";
import type { StateReservation } from "../interfaces/IReservation";

interface CardReservation {
  reservationDate: Date; 
  reserveTime: string; 
  commensalsNumber: number; 
  status: StateReservation;
  cancelationDate: Date | null; 
  onCancel?: () => void;
}

export function ReservationCard({reservationDate, reserveTime, commensalsNumber, status, cancelationDate, onCancel}: CardReservation) {

  const formatstatus = formatStatus(status);

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-amber-400 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="p-6 text-sm">
        <p className="mb-1"><strong>Fecha:</strong> {dateParser(reservationDate)}</p>
        <p className="mb-1"><strong>Hora:</strong> {reserveTime}</p>
        <p className="mb-1"><strong>Comensales:</strong> {commensalsNumber}</p>
        <p className="mb-1"><strong>Estado:</strong> {formatstatus}</p>
        { status === "Cancelada" && (
            <p className="mb-1"><strong>Fecha Cancelacion:</strong> {dateParser(cancelationDate)}</p>
          )
        }
        { status === "Realizada" && onCancel && (
            <button
              className="w-full border-4 cursor-pointer border-red-600 bg-red-600 text-white text-sm py-1.5 rounded   hover:shadow-lg shadow-red-200 transition-colors"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )
        }
      </div>
    </div>
  )
}