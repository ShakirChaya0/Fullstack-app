import { useState } from "react";
import useEntity from "../../Institution/hooks/useEntity";
import { fetchPolicy } from "../../Institution/services/fetchPolicy";
import { ConfirmModal } from "../components/ModalConfirmReservation";
import useReservationMutation from "../hooks/userReservationMutation";
import ReservationForm, { type ReservationFormData } from "../components/ReservationForm";

export default function ReservationPage() {
  const [showModal, setShowModal] = useState(false);
  const [pendingData, setPendingData] = useState<ReservationFormData | null>(null);

  const [, , policyData] = useEntity("Policy", fetchPolicy);

  // Hook de mutación para crear la reserva
  const { mutate, isPending: isMutating } = useReservationMutation({
    handleError: (errorMessage) => {
      console.error(errorMessage);
    },
  });

  const handleFormSubmit = (data: ReservationFormData) => {
    setPendingData(data);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!pendingData) return;

    mutate({
      _reserveDate: new Date(pendingData.FechaReserva),
      _reserveTime: pendingData.HoraReserva,
      _commensalsNumber: pendingData.CantidadComensales,
    });

    setShowModal(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingData(null);
  };

  const modalMessage = `Confirmar la reserva a las ${pendingData?.HoraReserva}. 
    Podés cancelar con ${policyData?._horasDeAnticipacionParaCancelar ?? 24} horas de antelación.`;

  return (
    <div className="bg-slate-100 w-full flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg">
        <ReservationForm onFormSubmit={handleFormSubmit} isMutating={isMutating} />
      </div>

      <ConfirmModal
        isOpen={showModal}
        title="Confirmar Reserva"
        message={modalMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmLabel="Confirmar"
      />
    </div>
  );
}
