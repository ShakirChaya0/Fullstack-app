import React, { useState } from "react";
import SignIn from "../components/SingIn";
import SignUp from "../components/SingUp";

type FormType = "signIn" | "signUp";

interface LoginProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const Login: React.FC<LoginProps> = ({
  title = "Bienvenido a nuestro restaurante",
  subtitle = "Inicia sesión en tu cuenta o crea una nueva",
  className = ""
}) => {
  const [activeForm, setActiveForm] = useState<FormType>("signIn");

  const handleFormSwitch = (formType: FormType): void => {
    if (formType !== activeForm) {
      setActiveForm(formType);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 font-sans p-3 sm:p-5 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 text-gray-800 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-sm">
          {title}
        </h2>
        <p className="text-base sm:text-lg opacity-90 font-light">
          {subtitle}
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden w-full max-w-xs sm:max-w-md md:max-w-4xl min-h-[500px] sm:min-h-[600px]">

        {/* Mobile View - Single Form Container */}
        <div className="block md:hidden h-full">
          {activeForm === "signIn" ? (
            <SignIn
              onSwitchToSignUp={() => handleFormSwitch("signUp")}
              isMobile={true}
            />
          ) : (
            <SignUp
              onSwitchToSignIn={() => handleFormSwitch("signIn")}
              isMobile={true}
            />
          )}
        </div>

        {/* Desktop View - Lógica Optimizada */}
        <div className="hidden md:block h-full">
          {/* Lógica de Renderizado Condicional del Contenido */}
          {activeForm === "signIn" && (
            <>
              {/* Contenedor de SignIn */}
              <div className="absolute top-0 h-full left-0 w-1/2 z-20">
                <SignIn />
              </div>
              
              {/* Contenedor de Overlay para SignIn */}
              <div className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-100">
                <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white relative -left-full h-full w-[200%] transform translate-x-0">
                  <div className="absolute right-0 flex items-center justify-center flex-col px-8 lg:px-10 text-center top-0 h-full w-1/2 transform translate-x-0">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-5 drop-shadow-md">
                      ¡Hola Compañero!
                    </h1>
                    <p className="text-sm lg:text-base font-light leading-relaxed mb-6 lg:mb-8 opacity-90">
                      Introduce tus datos personales y comienza tu viaje con nosotros
                    </p>
                    <button
                      className="rounded-full border-2 border-white bg-transparent text-white text-xs lg:text-sm font-semibold py-2 lg:py-3 px-8 lg:px-11 tracking-widest uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:bg-opacity-10 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                      onClick={() => handleFormSwitch("signUp")}
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeForm === "signUp" && (
            <>
              {/* Contenedor de SignUp */}
              <div className="absolute top-0 left-0 w-1/2 h-full z-50 transform translate-x-full">
                <SignUp onSwitchToSignIn={handleFormSwitch}/>
              </div>
              
              {/* Contenedor de Overlay para SignUp */}
              <div className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transform -translate-x-full z-100">
                <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white relative -left-full h-full w-[200%] transform translate-x-1/2">
                  <div className="absolute flex items-center justify-center flex-col px-8 lg:px-10 text-center top-0 h-full w-1/2 transform translate-x-0">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-5 drop-shadow-md">
                      ¡Bienvenido de nuevo!
                    </h1>
                    <p className="text-sm lg:text-base font-light leading-relaxed mb-6 lg:mb-8 opacity-90">
                      Para mantenerse conectado con nosotros, inicie sesión con su información personal.
                    </p>
                    <button
                      className="rounded-full border-2 border-white bg-transparent text-white text-xs lg:text-sm font-semibold py-2 lg:py-3 px-8 lg:px-11 tracking-widest uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:bg-opacity-10 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                      onClick={() => handleFormSwitch("signIn")}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;