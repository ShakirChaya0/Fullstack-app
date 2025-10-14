import Lottie from "lottie-react";
import animationWaitingForQR from "../assets/QR Code Scanner.json";

export default function WaitingForQR() {
  return (
    <Lottie animationData={animationWaitingForQR} loop={true} style={{ height: "25rem", width: "25rem" }} />
  );
}