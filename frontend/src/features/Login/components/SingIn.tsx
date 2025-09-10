import { Link } from "@mui/material";
import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";

interface SignInProps {
  onSwitchToSignUp?: () => void;
  isMobile?: boolean;
}

const SignIn: React.FC<SignInProps> = ({ onSwitchToSignUp, isMobile = false }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de envío del formulario
    console.log("Sign In submitted");
  };

  return (
    <div className="bg-white flex items-center justify-center flex-col px-6 sm:px-8 md:px-12 h-full text-center min-w-0">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Sign In</h1>
        
        {/* Social Login Buttons */}
        <div className="flex justify-center gap-3 sm:gap-4 my-4 sm:my-5">
          <button className="border border-gray-300 rounded-full inline-flex justify-center items-center w-10 h-10 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer hover:-translate-y-0.5 flex-shrink-0">
            <span className="text-sm font-semibold">f</span>
          </button>
          <button className="border border-gray-300 rounded-full inline-flex justify-center items-center w-10 h-10 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer hover:-translate-y-0.5 flex-shrink-0">
            <span className="text-sm font-semibold">G</span>
          </button>
          <button className="border border-gray-300 rounded-full inline-flex justify-center items-center w-10 h-10 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer hover:-translate-y-0.5 flex-shrink-0">
            <span className="text-xs font-semibold">in</span>
          </button>
        </div>
        
        <span className="text-sm text-gray-600 my-3 sm:my-4 block">or use your account</span>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full space-y-3">
            <input 
              className="bg-gray-50 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-blue-500 focus:shadow-sm focus:shadow-blue-200" 
              type="email" 
              placeholder="Email" 
              required
            />
            
            <input 
              className="bg-gray-50 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-blue-500 focus:shadow-sm focus:shadow-blue-200" 
              type="password" 
              placeholder="Password" 
              required
            />
          </div>

          <ForgotPassword open={open} handleClose={handleClose} />
          <div className="flex justify-center mt-5">
            <Link
              component="button"
              type="button"
              onClick={handleOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </div>
          
          <button 
            type="submit"
            className="w-full sm:w-auto rounded-full border-none bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold py-3 sm:py-4 px-8 sm:px-11 tracking-wide uppercase transition-all duration-300 cursor-pointer mt-4 sm:mt-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 active:scale-95"
          >
            Sign In
          </button>
        </form>
        
        {/* Mobile Switch Button */}
        {isMobile && onSwitchToSignUp && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-3">Don't have an account?</p>
            <button 
              onClick={onSwitchToSignUp}
              type="button"
              className="w-full rounded-full border-2 border-purple-500 bg-transparent text-purple-500 text-sm font-semibold py-3 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:bg-purple-500 hover:text-white active:scale-95"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;