import { useReservation } from "../hooks/useReservation"
import { ReservationCard } from "../components/ReservtionCard";
import useReservationMutation from "../hooks/userReservationMutation";
import type { IReservation } from "../interfaces/IReservation";


export default function ReservationList() {
    const {data: reservations, isLoading, error} = useReservation();
    const {mutate: UpdateReservation} = useReservationMutation({
        handleError: (msg) => console.log(msg), 
    });

    
    const handleCancel = (reservation: IReservation) => {
        UpdateReservation({
            _reservationId: reservation._reserveId, 
            _status: "Cancelada",
            _reserveDate: reservation._reserveDate,
            _reserveTime: reservation._reserveTime,
            _commensalsNumber: reservation._commensalsNumber
        })
    } 

    if(isLoading) return <p>Cargando...</p>
    if(error) return <p>Error al cargar las reservas</p>
    if(!reservations || reservations.length === 0) return <p>No tiene reservas registradas.</p>

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-8 text-center">Sus Reservas</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
                {reservations.map((res) => (
                    <ReservationCard
                        reservationDate={res._reserveDate}
                        reserveTime={res._reserveTime}
                        commensalsNumber={res._commensalsNumber}
                        status={res._status}
                        cancelationDate={res._cancelationDate}
                        onCancel={res._status === "Realizada" ? () => handleCancel(res) : undefined}
                    />
                ))}
            </div>
        </main>
    )
}