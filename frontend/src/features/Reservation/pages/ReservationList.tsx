import { useReservations } from "../hooks/useReservation"
import { ReservationCard } from "../components/ReservtionCard";
import useReservationMutation from "../hooks/userReservationMutation";
import { useEffect, useRef, useState } from "react";
import { ConfirmModal } from "../components/ModalConfirmReservation";
import dateParser from "../../../shared/utils/dateParser";

export default function ReservationList() {
    const {data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage} = useReservations(4);
    const {mutate: UpdateReservation} = useReservationMutation({
        handleError: (msg) => console.log(msg), 
    });
    
    const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
     const loadMoreRef = useRef<HTMLDivElement | null>(null);
    
    const handleCancel = (reservationId: number) => {
        const reservation = data?.pages.flatMap((page) => page.data).find(r => r._reserveId === reservationId)

        if (!reservation) return;

        UpdateReservation({
            _reservationId: reservation._reserveId, 
            _status: "Cancelada",
            _reserveDate: reservation._reserveDate,
            _reserveTime: reservation._reserveTime,
            _commensalsNumber: reservation._commensalsNumber
        })

        setSelectedReservation(null)
    } 

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { 
                threshold: 0.1, 
                rootMargin: "100px"
             } 
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef)
        };

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            };
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if(isLoading) return <p>Cargando...</p>
    if(error) return <p>Error al cargar las reservas</p>
    if(!data || data.pages.length === 0) return <p>No tiene reservas registradas.</p>

    const allReservations = data.pages.flatMap((page) => page.data);
    const reservationToCancel = allReservations.find((r) => r._reserveId === selectedReservation);

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-8 text-center">Sus Reservas</h1>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto">
                {data.pages.map((page, pageIndex) => (
                    <div key={`page-${pageIndex}`} className="contents">
                        {page.data.map((res) => (
                            <ReservationCard
                                key={res._reserveId}
                                reservationDate={res._reserveDate}
                                reserveTime={res._reserveTime}
                                commensalsNumber={res._commensalsNumber}
                                status={res._status}
                                cancelationDate={res._cancelationDate}
                                onCancel={() => setSelectedReservation(res._reserveId)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div ref={loadMoreRef} className="h-20 flex justify-center items-center mt-6">
                {isFetchingNextPage && (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="text-gray-600">Cargando más reservas...</span>
                    </div>
                )}
            </div>

              {reservationToCancel && (
                <ConfirmModal
                  isOpen={true}
                  title="Cancelar Reserva"
                  message={`¿Seguro que quieres cancelar la reserva para la fecha ${dateParser(reservationToCancel._reserveDate)}?`}
                  confirmLabel="Cancelar Reserva"
                  onCancel={() => setSelectedReservation(null)}
                  onConfirm={() => handleCancel(reservationToCancel._reserveId)}
                />
                )}
        </main>
    )
}