import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

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

      <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden w-full max-w-xs sm:max-w-md md:max-w-3xl min-h-[500px] sm:min-h-[540px]`}>

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

        <div className="hidden md:block h-full">
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
              activeForm === "signUp"
                ? "translate-x-full opacity-100 z-50"
                : "translate-x-0 opacity-0 z-10"
            }`}
          >
            <SignUp onSwitchToSignIn={() => handleFormSwitch("signIn")} />
          </div>

          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
              activeForm === "signUp"
                ? "-translate-x-full opacity-0 z-10"
                : "translate-x-0 opacity-100 z-20"
            }`}
          >
            <SignIn />
          </div>

          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${
              activeForm === "signUp" ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div
              className={`bg-gradient-to-r from-teal-700 to-teal-800 text-white relative -left-full h-full w-[200%] transition-transform duration-700 ease-in-out ${
                activeForm === "signUp" ? "translate-x-1/2" : "translate-x-0"
              }`}
            >

              <div
                className={`absolute top-0 flex items-center justify-center flex-col px-10 text-center h-full w-1/2 transition-transform duration-700 ease-in-out ${
                  activeForm === "signUp" ? "translate-x-0" : "-translate-x-[20%]"
                }`}
              >
                <h1 className="text-3xl font-bold mb-5 drop-shadow-md">
                  ¡Bienvenido de nuevo!
                </h1>
                <p className="text-base font-light leading-relaxed mb-8">
                  Para mantenerse conectado, inicie sesión con su información personal.
                </p>
                <button
                  className="rounded-full border-2 border-white bg-transparent text-white text-sm font-semibold py-3 px-11 tracking-widest uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:text-black active:scale-95"
                  onClick={() => handleFormSwitch("signIn")}
                >
                  Iniciar Sesión
                </button>
              </div>

              <div
                className={`absolute top-0 right-0 flex items-center justify-center flex-col px-10 text-center h-full w-1/2 transition-transform duration-700 ease-in-out ${
                  activeForm === "signUp" ? "translate-x-[20%]" : "translate-x-0"
                }`}
              >
                <h1 className="text-3xl font-bold mb-5 drop-shadow-md">
                  ¡Hola Compañero!
                </h1>
                <p className="text-base font-light leading-relaxed mb-8">
                  Introduce tus datos y comienza tu viaje con nosotros.
                </p>
                <button
                  className="rounded-full border-2 border-white bg-transparent text-white text-sm font-semibold py-3 px-11 tracking-widest uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:text-black active:scale-95"
                  onClick={() => handleFormSwitch("signUp")}
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;