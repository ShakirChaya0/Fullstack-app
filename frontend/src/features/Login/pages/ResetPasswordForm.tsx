import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { resetPassword } from "../services/resetPassword";
import { toast } from "react-toastify";
import { useState } from "react";

interface FormData {
    newPassword: string;
}

export default function ResetPasswordForm() {
    const [error, setError] = useState<string>("");

    const {
        register,           
        handleSubmit,       
        formState: { errors },
    } = useForm<FormData>();

    const { mutate } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Contraseña restablecida con éxito");
            // redirigir al login
        },
        onError: (error) => {
            toast.error("No se pudo restablecer la contraseña");
            setError((error as Error).message);
            console.log(error);
        },
    });

    const onSubmit = (data: FormData) => {
        mutate(data);
    };

    return (
        <main className="flex flex-col items-center justify-center gap-4 min-h-screen bg-gray-200 p-4">
            <h2 className="text-2xl font-bold mb-4">Recuperar Contraseña</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-semibold text-gray-800" htmlFor="newPassword">Nueva Contraseña</label>
                    <input 
                        id="newPassword"
                        type="text"
                        {...register("newPassword", {
                            required: "Debe ingresar una nueva contraseña",
                            minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" },
                            maxLength: { value: 100, message: "La contraseña no puede tener más de 100 caracteres" },
                            pattern: { 
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, 
                                message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número" 
                            }
                        })}
                        placeholder="ej: NuevaContraseña123"
                        className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition" 
                    />
                    {errors.newPassword && <p className="text-base text-red-500">{errors.newPassword.message}</p>}    
                    {error && <p className="text-base text-red-500">{error}</p>}
                </div>

                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer">
                    Confirmar
                </button>
            </form>

        </main >
    );
}