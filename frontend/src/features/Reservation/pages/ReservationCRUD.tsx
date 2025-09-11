import { useState } from "react";
import ReservationForm, { type FormData } from "../components/ReservationForm";
import useReservationMutation from "../hooks/userReservationMutation";
import { ConfirmModal } from "../components/ModalConfirmReservation";
import useEntity from "../../Institution/hooks/useEntity";
import { fetchPolicy } from "../../Institution/services/fetchPolicy";
import type Policy from "../../Institution/interfaces/Policy";


export default function ReservationCRUD() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const handleError = (message: string | null) => setErrorMessage(message);
    const[,,data] = useEntity<Policy>("Policy",fetchPolicy);
    const [pendingData, setPendingData] = useState<FormData | null>(null); 

    const { mutate } = useReservationMutation({
        handleError,
        reservation: undefined
  });

    const handleFormSubmit = (data: FormData) => {
        setPendingData(data);
        setShowModal(true); // abrir modal antes de mutación
  };

    const handleConfirm = () => {
    if (!pendingData) return;

        mutate({
            _reserveDate: new Date(pendingData.FechaReserva),
            _reserveTime: pendingData.HoraReserva,
            _commensalsNumber: pendingData.CantidadComensales
        });
    }

    const handleCancel = () => {
        setShowModal(false);
        setPendingData(null);
    };

    const modalMessage = `Confirmar la reserva a las ${pendingData?.HoraReserva}. Podes cancelar las mismas con antelacion de ${data?._horasDeAnticipacionParaCancelar} horas`

    return (
        <main className="p-4">
          <ReservationForm onError={handleError} onFormSubmit={handleFormSubmit} />
            {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        
          <ConfirmModal
            isOpen={showModal}
            title="Confirmar Reserva"
            message={modalMessage}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </main>
  );
    
    
}
