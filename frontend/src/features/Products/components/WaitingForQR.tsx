import Lottie from "lottie-react";
import animationWaitingForQR from "../assets/QR Code Scanner.json";

export default function WaitingForQR() {
  return (
    <div className="flex justify-center items-center w-full">
      <Lottie 
        animationData={animationWaitingForQR} 
        loop={true} 
        className="w-full max-w-xs sm:max-w-sm md:max-w-md"
        style={{ aspectRatio: "1 / 1" }}
      />
    </div>
  );
}