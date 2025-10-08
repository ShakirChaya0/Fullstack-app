import type { StateReservation } from "../interfaces/IReservation";

const today = new Date();
export const hoy = today.toLocaleDateString("es-AR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).split("/").reverse().join("-");

// Función auxiliar para obtener los estilos de Tailwind según el estado
export const getStatusClasses = (status: StateReservation) => {
  switch (status) {
    case 'Asistida':
      return { 
        bg: 'bg-green-100 text-green-800', 
        border: 'border-teal-500' 
      };
    case 'No_Asistida':
      return { 
        bg: 'bg-red-100 text-red-800', 
        border: 'border-gray-500' 
      };
    case 'Realizada':
      return { 
        bg: 'bg-blue-100 text-blue-800', 
        border: 'border-blue-500' 
      };
    default:
      return { 
        bg: 'bg-gray-200 text-gray-800', 
        border: 'border-gray-400' 
      };
  }
};

export const modalMessageAsistencia = "¿Seguro que deseas ingresar la asistencia de la reserva? ";  

export const modalMessageNoAsistencia = "¿Seguro que deseas ingresar la inasistencia de la reserva? ";  