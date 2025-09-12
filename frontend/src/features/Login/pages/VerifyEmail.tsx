import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';

type Status = 'verifying' | 'success' | 'error';

async function resendVerificationEmailAPI() {

}

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados: 'verifying', 'success', 'error'
    const [status, setStatus] = useState<Status>('verifying');
    const [isResending, setIsResending] = useState<boolean>(false);

    useEffect(() => {
        // Simula la verificación del token de la URL cuando la página carga
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");


    }, [location.search]);

    const handleNavigateToLogin = () => {
        navigate('/login');
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            await resendVerificationEmailAPI();
            toast.success("Se ha enviado un nuevo correo de verificación.");
        } catch (error) {
            toast.error("No se pudo reenviar el correo. Inténtalo más tarde.");
        } finally {
            setIsResending(false);
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <>
                        <CircularProgress sx={{ color: 'teal' }} />
                        <h3 className="text-2xl font-bold text-gray-800 mt-6">
                            Verificando tu correo...
                        </h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Por favor, espera un momento.
                        </p>
                    </>
                );

            case 'success':
                return (
                    <>
                        <CheckCircleOutlineIcon className="text-6xl text-teal-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            ¡Correo Verificado! ✅
                        </h3>
                        <p className="text-gray-600 text-sm mb-8">
                            Tu dirección de correo ha sido confirmada. Ya puedes iniciar sesión.
                        </p>
                        <button 
                            onClick={handleNavigateToLogin}
                            className="w-full rounded-full border-none bg-gradient-to-r from-teal-700 to-teal-800 text-white text-sm font-semibold py-3 sm:py-4 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-300 active:scale-95"
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </>
                );

            case 'error':
                return (
                    <>
                        <ErrorOutlineIcon className="text-6xl text-red-500 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            ¡Hubo un problema! 😟
                        </h3>
                        <p className="text-gray-600 text-sm mb-8">
                            No pudimos verificar tu correo. El enlace puede haber expirado o ser incorrecto.
                        </p>
                        <button 
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="w-full rounded-full border-none bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold py-3 sm:py-4 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? 'Reenviando...' : 'Reenviar Correo'}
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 font-sans p-3 sm:p-5">
            <div className="text-center mb-6 sm:mb-8 text-gray-800 px-4">
                <div className="flex justify-center mb-2">
                    <RestaurantIcon className="text-5xl text-teal-700" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-sm">
                    Restaurante
                </h2>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-sm flex flex-col items-center text-center min-h-[300px] justify-center">
                {renderContent()}
            </div>
        </main>
    );
}