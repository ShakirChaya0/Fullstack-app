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
  title = "Welcome to Our Platform",
  subtitle = "Sign in to your account or create a new one",
  className = ""
}) => {
  const [activeForm, setActiveForm] = useState<FormType>("signIn");

  const handleFormSwitch = (formType: FormType): void => {
    if (formType !== activeForm) {
      setActiveForm(formType);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 font-sans p-3 sm:p-5 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 text-white px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
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

        {/* Desktop View - Side by Side Forms */}
        <div className="hidden md:block h-full">
          {/* Sign Up Form */}
          <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-600 ease-in-out ${
            activeForm === "signUp" 
              ? "transform translate-x-full opacity-100 z-50" 
              : "opacity-0 z-10"
          }`}>
            <SignUp />
          </div>

          {/* Sign In Form */}
          <div className={`absolute top-0 h-full left-0 w-1/2 z-20 transition-all duration-600 ease-in-out ${
            activeForm === "signUp" ? "transform translate-x-full" : ""
          }`}>
            <SignIn />
          </div>
          
          {/* Overlay Container */}
          <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 ${
            activeForm === "signUp" ? "transform -translate-x-full" : ""
          }`}>
            <div className={`bg-gradient-to-r from-pink-500 to-red-500 text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out ${
              activeForm === "signUp" ? "translate-x-1/2" : "translate-x-0"
            }`}>
              
              {/* Left Overlay Panel - Welcome Back */}
              <div className={`absolute flex items-center justify-center flex-col px-8 lg:px-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${
                activeForm === "signUp" ? "translate-x-0" : "-translate-x-1/5"
              }`}>
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-5 drop-shadow-md">
                  Welcome Back!
                </h1>
                <p className="text-sm lg:text-base font-light leading-relaxed mb-6 lg:mb-8 opacity-90">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="rounded-full border-2 border-white bg-transparent text-white text-xs lg:text-sm font-semibold py-2 lg:py-3 px-8 lg:px-11 tracking-widest uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:bg-opacity-10 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                  onClick={() => handleFormSwitch("signIn")}
                >
                  Sign In
                </button>
              </div>
              
              {/* Right Overlay Panel - Hello Friend */}
              <div className={`absolute right-0 flex items-center justify-center flex-col px-8 lg:px-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${
                activeForm === "signUp" ? "translate-x-1/5" : "translate-x-0"
              }`}>
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-5 drop-shadow-md">
                  Hello, Friend!
                </h1>
                <p className="text-sm lg:text-base font-light leading-relaxed mb-6 lg:mb-8 opacity-90">
                  Enter your personal details and start your journey with us
                </p>
                <button
                  className="rounded-full border-2 border-white bg-transparent text-white text-xs lg:text-sm font-semibold py-2 lg:py-3 px-8 lg:px-11 tracking-widest uppercase transition-all duration-300 cursor-pointer hover:bg-white hover:bg-opacity-10 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                  onClick={() => handleFormSwitch("signUp")}
                >
                  Sign Up
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