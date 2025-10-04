import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import successAnimation from "../assets/success_animation.json";

export default function SuccessfulPaymentPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/") // poner la ruta de la landing page cuando la implementemos
    }

    return (
        <div className="bg-[var(--background-200)] w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white  rounded-2xl shadow-xl text-center p-8 md:p-12 transform transition-all hover:scale-102 duration-300">
                
                <div className="flex items-center justify-center mb-6">
                    <Lottie animationData={successAnimation} loop={false} style={{ height: 200, width: 200 }} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-slate-600 mb-8">
                    Tu pago ha sido procesado correctamente. Agradecemos tu visita y esperamos verte pronto.
                </p>
                
                <button
                    onClick={handleClick}
                    className="flex mx-auto cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-100 active:scale-95"
                >
                    Volver al Inicio
                </button>

            </div>
        </div>
    );
}
