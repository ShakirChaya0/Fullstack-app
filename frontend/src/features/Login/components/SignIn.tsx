import { IconButton, InputAdornment, Link, OutlinedInput } from "@mui/material";
import { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import useAuth from "../../../shared/hooks/useAuth";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface SignInProps {
  onSwitchToSignUp?: () => void;
  isMobile?: boolean;
}

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC<SignInProps> = ({ onSwitchToSignUp, isMobile = false }) => {
  const { login } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const response = await login(data.email, data.password);
    if (response?.success) {
      toast.success("Inicio de sesión exitoso");
    } else {
      toast.error("Error al iniciar sesión: " + (response?.error || "Error desconocido"));
    }
  };

  return (
    <div className="bg-white flex flex-col items-center h-full text-center min-w-0 px-6 sm:px-8 md:px-12 py-8 sm:py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Iniciar Sesión</h1>
        
        <span className="text-sm text-gray-600 my-3 sm:my-4 block">Usa tu cuenta</span>
        
        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex-col gap-3 sm:gap-4 flex">
            <div>
              <input 
                className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                type="email" 
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Ingresa un correo electrónico válido."
                  }
                })}
                placeholder="Email" 
              />
              {errors.email && <p className="text-sm text-red-500 text-left mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <div className="relative w-full">
                <input 
                  className="bg-gray-100 border-2 border-transparent rounded-xl pl-4 pr-12 sm:pl-5 sm:pr-12 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                  type={isVisible ? "text" : "password"} 
                  placeholder="Contraseña" 
                  {...register("password", {
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
              {errors.password && <p className="text-sm text-red-500 mt-1 text-left">{errors.password.message}</p>}
            </div>              
                          
          </div>
          
          <button 
            type="submit"
            className="w-full sm:w-auto rounded-full border-none bg-gradient-to-r from-teal-700 to-teal-800 text-white text-sm font-semibold py-3 sm:py-4 px-8 sm:px-11 tracking-wide uppercase transition-all duration-300 cursor-pointer mt-4 sm:mt-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-300 active:scale-95"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* El componente ForgotPassword se mueve fuera del formulario para funcionar correctamente */}
        <ForgotPassword open={open} handleClose={handleClose} />
        <div className="flex justify-center mt-5">
          <Link
            component="button"
            type="button"
            onClick={handleOpen}
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
    


        {/* Botón de cambio a registro (móvil) */}
        {isMobile && onSwitchToSignUp && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-3">¿No tienes una cuenta?</p>
            <button 
              onClick={onSwitchToSignUp}
              type="button"
              className="w-full rounded-full border-2 border-teal-600 bg-transparent text-teal-600 text-sm font-semibold py-3 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:bg-teal-600 hover:text-white active:scale-95"
            >
              Crear una cuenta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
