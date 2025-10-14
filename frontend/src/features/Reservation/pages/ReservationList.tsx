import { useReservations } from "../hooks/useReservation"
import { ReservationCard } from "../components/ReservtionCard";
import useReservationMutation from "../hooks/userReservationMutation";
import { useEffect, useRef, useState } from "react";
import { ConfirmModal } from "../components/ModalConfirmReservation";
import dateParser from "../../../shared/utils/dateParser";
import { AlertCircle, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function ReservationList() {
    const {data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage} = useReservations(4, "byClient");
    const {mutate: UpdateReservation} = useReservationMutation({
        handleError: (msg) => console.log(msg), 
    });
    
    const navigate = useNavigate();

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

    if(isLoading) {
            return (
                <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-800">Cargando sus reservas</h2>
                            <p className="text-sm text-gray-500 mt-1">Preparando su información...</p>
                        </div>
                    </div>
                </div>
            );
        }

        
        if(!data || data.pages.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 rounded-full p-4">
                            <Calendar className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay reservas</h2>
                    <p className="text-gray-600 mb-6">
                        Aún no tienes ninguna reserva registrada. ¡Comienza a reservar ahora!
                    </p>
                    <button
                        onClick={() => navigate("../Reserva")}
                        className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                        >
                        Hacer una reserva
                    </button>
                </div>
            </div>
        );
    }
        if(error) {
            return (
                <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-6">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-l-4 border-red-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-red-100 rounded-full p-2">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Error al cargar</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            No se pudieron cargar sus reservas. Por favor, verifica tu conexión e intenta nuevamente.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            );
        }
    
    const allReservations = data.pages.flatMap((page) => page.data);
    const reservationToCancel = allReservations.find((r) => r._reserveId === selectedReservation);

    return (
        <div className="p-6 w-full">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Sus Reservas</h1>
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
        </div>
    )
}