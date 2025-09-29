import type { BackendSchedule } from "../types/scheduleTypes";
import { completeSchedule } from "../utils/completeSchedule";

export const getScheduleData = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>
) => {
  const response = await apiCall('horarios/');

  if (!response.ok) {
    // Si es 404, intentar obtener el mensaje del JSON del backend
    if (response.status === 404) {
      try {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'No hay horarios cargados');
        error.name = 'NotFoundError';
        throw error;
      } catch {
        // Si no se puede parsear el JSON, usar mensaje por defecto
        const error = new Error('No hay horarios cargados');
        error.name = 'NotFoundError';
        throw error;
      }
    }
    // Para otros errores
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar los horarios en el backend
export const modifySchedulesToBackend = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  schedules: BackendSchedule[], 
  originalSchedules: BackendSchedule[]
) => {

  if(!completeSchedule(schedules)) throw new Error("Horarios incompletos");

  //Ejecutar modificación solo en aquellos horarios que fueron modificados
  const modifiedSchedules = schedules.filter((schedule, index) => {
    const original = originalSchedules[index];
    return schedule.horaApertura !== original.horaApertura || schedule.horaCierre !== original.horaCierre;
  });

  if (modifiedSchedules.length === 0) {
    // Situación: se presiona el boton Guardar sin modificar ningun horario, no se ejecuta ningun fetch
    return [];
  }

  // Requests paralelos usando Promise.all
  const promises = modifiedSchedules.map(schedule => 
    apiCall(`horarios/update/${schedule.diaSemana}`, {
      method: 'PATCH',
      body: JSON.stringify({
        horaApertura: schedule.horaApertura,
        horaCierre: schedule.horaCierre
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
  );

  // Ejecutar todas las requests en paralelo
  return Promise.all(promises);
};

// Función para guardar los horarios en el backend
export const saveSchedulesToBackend = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  schedules: BackendSchedule[]
) => {
    // Validar todos los horarios completados
    let validSchedule = true
    schedules.forEach(oneSchedule => {
        if(!oneSchedule.horaApertura || !oneSchedule.horaCierre) validSchedule = false
    });

    if(schedules.length !== 7) throw new Error("Todos los días deben tener horarios asignados");

    if(!validSchedule) throw new Error("Existen horarios incompletos");

    // Requests paralelos usando Promise.all
    const promises = schedules.map(schedule => 
      apiCall('horarios/', {
        method: 'POST',
        body: JSON.stringify(schedule)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
    );

    // Ejecutar todas las requests en paralelo
    return Promise.all(promises);
};