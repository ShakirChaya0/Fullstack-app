import Lottie from "lottie-react";
import { useNavigate, useParams } from "react-router";
import errorAnimation from "../assets/error_animation.json";

export default function FailurePaymentPage() {
    const idPedido = useParams()
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/Cliente/Pedido/Cuenta/${idPedido.idPedido}`, { replace: true })
    }

    return (
        <div className="bg-[var(--background-200)] w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white  rounded-2xl shadow-xl text-center p-8 md:p-12 transform transition-all hover:scale-102 duration-300">
                
                <div className="flex items-center justify-center mb-6">
                    <Lottie animationData={errorAnimation} loop={false} style={{ height: 165, width: 165 }} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Pago Rechazado
                </h1>
                <p className="text-slate-600 mb-8">
                    Lamentablemente, no pudimos procesar tu pago. Por favor, vuelva a intentarlo o seleccione otro método de pago.
                </p>
                
                <button
                    onClick={handleClick}
                    className="mx-auto cursor-pointer bg-[var(--accent-300)] hover:bg-[var(--text-200)] text-white font-bold py-3 px-5 rounded-lg transition-all duration-100 active:scale-95"
                >
                    Volver
                </button>

            </div>
        </div>
    )
}
