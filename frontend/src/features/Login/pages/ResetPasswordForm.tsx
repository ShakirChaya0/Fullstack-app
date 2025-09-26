import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { resetPassword } from "../services/resetPassword";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from 'react-router';
import RestaurantIcon from '@mui/icons-material/Restaurant'; 
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FormData {
    newPassword: string;
}

export default function ResetPasswordForm() {
    const [error, setError] = useState<string>("");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Contraseña restablecida con éxito.");
            navigate('/login');
        },
        onError: (error) => {
            toast.error("No se pudo restablecer la contraseña.");
            setError((error as Error).message);
            console.log(error);
        },
    });

    const onSubmit = (data: FormData) => {
        mutate(data);
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

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-sm flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Nueva Contraseña
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                    Por favor, ingresa tu nueva contraseña para acceder a tu cuenta.
                </p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6 w-full">
                    <div>
                        <div className="relative w-full">
                          <input 
                            className="bg-gray-100 border-2 border-transparent rounded-xl pl-4 pr-12 sm:pl-5 sm:pr-12 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                            type={isVisible ? "text" : "password"} 
                            placeholder="Contraseña" 
                            {...register("newPassword", {
                              required: "La contraseña es obligatoria",
                              minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres." },
                              maxLength: { value: 100, message: "La contraseña no puede tener más de 100 caracteres." },
                              pattern: {
                                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                                  message: "Debe incluir una mayúscula, una minúscula y un número."
                              }
                            })}
                          />
                          <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                            {isVisible ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </div>
                        {errors.newPassword && <p className="text-sm text-red-500 mt-1 text-left">{errors.newPassword.message}</p>}
                 </div>

                <button 
                    type="submit" 
                    className="w-full rounded-full border-none bg-gradient-to-r from-teal-700 to-teal-800 text-white text-sm font-semibold py-3 sm:py-4 px-8 sm:px-11 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPending}
                >
                    {isPending ? 'Confirmando...' : 'Confirmar'}
                </button>

                </form>
            </div>
        </main>
    );
}