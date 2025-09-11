import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/forgotPassword';
import { useNavigate } from 'react-router'; 

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

interface FormData {
    email: string;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            toast.success("¡Listo! Revisa tu correo electrónico para restablecer tu contraseña.");
            handleClose();
            navigate('/login');
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const onSubmit = (data: FormData) => {
        mutate(data);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: handleSubmit(onSubmit),
                    sx: { backgroundImage: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
                },
            }}
        >
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-800 text-center pt-8 px-6 pb-2">Recuperar Contraseña</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingX: 3, paddingY: 2, width: '100%' }}>
                <p className="text-gray-600 text-sm text-center">Ingresa tu dirección de correo electrónico para recibir un enlace de restablecimiento de contraseña.</p>
                <input
                    type="text"
                    {...register("email", {
                        required: "El correo electrónico es obligatorio.",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Ingresa un correo electrónico válido."
                        }
                    })}
                    placeholder="tu-correo@ejemplo.com"
                    className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200"
                />
                {errors.email && <p className="text-sm text-red-500 text-center mt-1">{errors.email.message}</p>}
                {error && <p className="text-sm text-red-500 text-center mt-1">{error}</p>}
            </DialogContent>
            <div className="flex flex-row justify-center gap-4 m-6 mt-2">
                <button
                    type="button"
                    onClick={handleClose}
                    className="w-1/2 rounded-full border-2 border-gray-400 bg-white text-gray-700 text-sm font-semibold py-3 px-6 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:bg-gray-100 active:scale-95"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="w-1/2 rounded-full border-none bg-gradient-to-r from-teal-700 to-teal-800 text-white text-sm font-semibold py-3 px-6 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPending}
                >
                    {isPending ? 'Enviando...' : 'Restablecer'}
                </button>
            </div>
        </Dialog>
    );
}