import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/forgotPassword';

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

interface FormData {
    email: string;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    const [error, setError] = useState<string>("");

    const {
        register,           
        handleSubmit,       
        formState: { errors },
    } = useForm<FormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            toast.success("Se ha enviado un correo para restablecer la contraseña");
            handleClose();
        },
        onError: (error) => {
            setError((error as Error).message);
            console.log(error);
        },
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
                    sx: { backgroundImage: 'none' },
                },
            }}
        >
            <DialogTitle>Recuperar Contraseña</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }} >
                <p className="text-gray-700">Ingrese su dirección de correo electrónico para recibir un enlace de restablecimiento de contraseña.</p>
                <input 
                    id="newPassword"
                    type="text"
                    {...register("email", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Debe ingresar un correo válido"
                        }
                    })}
                    placeholder="tu-correo@ejemplo.com"
                    className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition" 
                />
                {errors.email && <p className="text-base text-red-500">{errors.email.message}</p>}    
                {error && <p className="text-base text-red-500">{error}</p>}
            </DialogContent>
            <div className='flex flex-row gap-6 m-6 mt-1'>
                <button type="button" onClick={handleClose} className="w-full bg-white border-2 border-gray-700 hover:bg-gray-200 font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer">
                    Cancelar
                </button>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer">
                    Confirmar
                </button>
            </div>
        </Dialog>
    );
}
