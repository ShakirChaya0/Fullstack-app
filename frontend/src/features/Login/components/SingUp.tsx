import React from "react";

interface SignUpProps {
  onSwitchToSignIn?: () => void;
  isMobile?: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToSignIn, isMobile = false }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de envío del formulario
    console.log("Sign Up submitted");
  };

  return (
    <div className="bg-white flex items-center justify-center flex-col px-6 sm:px-8 md:px-12 h-full text-center min-w-0">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Create Account</h1>
        
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
        
        <span className="text-sm text-gray-600 my-3 sm:my-4 block">or use your email for registration</span>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full space-y-3">
            <input 
              className="bg-gray-50 border-2 border-transparent rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full text-sm transition-all duration-300 outline-none focus:bg-white focus:border-blue-500 focus:shadow-sm focus:shadow-blue-200" 
              type="text" 
              placeholder="Name" 
              required
            />
            
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
              minLength={6}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full sm:w-auto rounded-full border-none bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold py-3 sm:py-4 px-8 sm:px-11 tracking-wide uppercase transition-all duration-300 cursor-pointer mt-4 sm:mt-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 active:scale-95"
          >
            Sign Up
          </button>
        </form>
        
        {/* Mobile Switch Button */}
        {isMobile && onSwitchToSignIn && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-3">Already have an account?</p>
            <button 
              onClick={onSwitchToSignIn}
              type="button"
              className="w-full rounded-full border-2 border-blue-500 bg-transparent text-blue-500 text-sm font-semibold py-3 tracking-wide uppercase transition-all duration-300 cursor-pointer hover:bg-blue-500 hover:text-white active:scale-95"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;