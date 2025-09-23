import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createUser } from "../services/createUser";
import { toast } from "react-toastify";
import dateParser from "../../../shared/utils/dateParser";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FormType = "signIn" | "signUp";

// Define la estructura de los datos del formulario de un cliente
interface FormData {
  userName: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
}

interface SignUpProps {
  onSwitchToSignIn: (formType: FormType) => void;
  isMobile?: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToSignIn, isMobile = false }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Se ha enviado el mail de verificación. Por favor, revisa tu bandeja de entrada.");
      onSwitchToSignIn("signIn");
    },
    onError: (error) => {
      toast.error(`Error al crear el usuario: ${error.message}`);
    }
  });

  const onSubmit = (data: FormData) => {
    mutate({ 
      email: data.email,
      nombreUsuario: data.userName,
      contrasenia: data.password,
      nombre: data.name,
      apellido: data.lastName,
      telefono: data.phone,
      fechaNacimiento: dateParser(data.birthDate) 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white text-center min-w-0">
      {/* Contenedor principal con altura flexible y desplazamiento */}
      <div className="flex-grow flex flex-col items-center justify-start overflow-y-auto py-4 sm:py-6">
        <div className="w-full max-w-sm px-6 sm:px-8 md:px-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Crear una cuenta</h1>
          
          <span className="text-sm text-gray-600 my-2 sm:my-3 block">Utiliza tu correo electrónico para registrarte</span>
          
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-6">
            <div className="w-full flex-col gap-3 sm:gap-4 flex">

              <div>
                <input 
                  className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                  type="text" 
                  placeholder="Nombre de Usuario"
                  disabled={isPending}
                  {...register("userName", { 
                    required: "El nombre de usuario es obligatorio" ,
                    minLength: { value: 4, message: "Debe tener al menos 4 caracteres" },
                  })}
                />
                {errors.userName && <p className="text-xs text-red-500 text-left mt-1">{errors.userName.message}</p>}
              </div>

              <div>
                <input 
                  className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                  type="text" 
                  placeholder="Nombre"
                  disabled={isPending}
                  {...register("name", { 
                    required: "El nombre es obligatorio",
                    minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                  })}
                />
                {errors.name && <p className="text-xs text-red-500 text-left mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <input 
                  className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                  type="text" 
                  placeholder="Apellido"
                  disabled={isPending}
                  {...register("lastName", { 
                    required: "El apellido es obligatorio", 
                    minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                  })}
                />
                {errors.lastName && <p className="text-xs text-red-500 text-left mt-1">{errors.lastName.message}</p>}
              </div>

              <div>
                <input 
                  className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                  type="email" 
                  placeholder="Email"
                  disabled={isPending}
                  {...register("email", { 
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Debe ingresar un email válido"
                    }
                  })}
                />
                {errors.email && <p className="text-xs text-red-500 text-left mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <input 
                  className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                  type="tel" 
                  placeholder="Teléfono"
                  disabled={isPending}
                  {...register("phone", { 
                    required: "El teléfono es obligatorio",
                    minLength: { value: 5, message: "Debe tener al menos 5 caracteres" },
                    maxLength: { value: 15, message: "No puede exceder los 15 caracteres" },
                    pattern: {
                      value: /^\+?\d+$/,
                      message: "Solo números y puede incluir un + al inicio",
                    },
                  })}
                />
                {errors.phone && <p className="text-xs text-red-500 text-left mt-1">{errors.phone.message}</p>}
              </div>
                           
              <div className="relative">
                  <label htmlFor="birthDate" className="absolute -top-1 left-3 px-1 text-xs text-gray-500 bg-white">
                      Fecha de Nacimiento
                  </label>
                  <input 
                      id="birthDate"
                      className="bg-gray-100 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                      type="date" 
                      placeholder="dd/mm/aaaa"
                      disabled={isPending}
                      {...register("birthDate", { required: "La fecha de nacimiento es obligatoria" })}
                  />
                  {errors.birthDate && <p className="text-xs text-red-500 text-left mt-1">{errors.birthDate.message}</p>}
              </div>

              <div>
                <div className="relative w-full">
                  <input 
                    className="bg-gray-100 border-2 border-transparent rounded-xl pl-4 pr-12 sm:pl-5 sm:pr-12 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-teal-500 focus:shadow-sm focus:shadow-teal-200" 
                    type={isVisible ? "text" : "password"} 
                    placeholder="Contraseña"
                    disabled={isPending}
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
                {errors.password && <p className="text-xs text-red-500 mt-1 text-left">{errors.password.message}</p>}
              </div>
          
            </div>
            
            <button 
              type="submit"
              className="w-full sm:w-auto rounded-full border-none bg-gradient-to-r from-teal-700 to-teal-800 text-white text-sm font-semibold py-3 sm:py-4 px-8 sm:px-11 tracking-wide uppercase transition-all duration-300 cursor-pointer mt-4 sm:mt-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? 'Cargando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Mobile Switch Button (fuera del área de scroll) */}
      {isMobile && onSwitchToSignIn && (
        <div className="pb-4 border-t border-gray-200 px-6 sm:px-8 md:px-12 mt-6">
          <p className="text-gray-600 text-sm mb-3">¿Ya tienes una cuenta?</p>
          <button 
            onClick={() => onSwitchToSignIn("signIn")}
            type="button"
            className="w-full rounded-full border-2 border-teal-600 bg-transparent text-teal-600 text-sm font-semibold py-3 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:bg-teal-600 hover:text-white active:scale-95"
          >
            Iniciar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
