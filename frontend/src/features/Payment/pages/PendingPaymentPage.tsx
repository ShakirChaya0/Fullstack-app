import Lottie from "lottie-react";
import pendingAnimation from "../assets/pending_animation.json";
import { animationStyles } from "../constants/PaymentConstants";
import SuccessfulPaymentPage from "./SuccessfulPaymentPage";
import { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "../../../shared/hooks/useWebSocket";

export default function PendingPaymentPage() {
    // useBlockNavigation(true, "¿Seguro que quieres salir?") //Bloque de acciones para ir hacia atras
    // const { handleRecoveyInitialState } = useOrderActions()
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">('pending');
    const { onEvent, offEvent } = useWebSocket();

      
    const handleStatusChange = useCallback(() => {
        setPaymentStatus("success")
        // handleRecoveyInitialState()
    }, []);

    useEffect(() => {
        onEvent("orderPaymentEvent", handleStatusChange);

        return () => {
            offEvent("orderPaymentEvent", handleStatusChange)
        }
    }, [onEvent, offEvent, handleStatusChange]);
    
    if (paymentStatus === "success") return <SuccessfulPaymentPage />; 

    return (
        <>
            <style>{animationStyles}</style>
            <div className="bg-[var(--background-200)] w-full flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white  rounded-2xl shadow-xl text-center p-8 md:p-12 transform transition-all hover:scale-102 duration-300">

                    <div className="flex items-center justify-center">
                        <Lottie animationData={pendingAnimation} style={{ height: 200, width: 200 }} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        Procesando Solicitud
                        <span className="blinking-dots inline-block ml-1 w-10 text-left">
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                    </h1>
                    <p className="text-slate-600 mb-8">
                        Hemos notificado al mozo. Se acercará a su mesa en breve para completar el pago.
                    </p>

                     <p className="text-sm text-slate-500">
                        Gracias por su paciencia.
                    </p>

                </div>
            </div>
        </>
    );
}

