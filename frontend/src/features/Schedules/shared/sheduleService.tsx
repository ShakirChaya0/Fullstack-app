import type { BackendSchedule } from "../hooks/useScheduleState";

export const getScheduleData = async () => {
  const response = await fetch('http://localhost:3000/horarios/', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar los horarios en el backend
export const modifySchedulesToBackend = async (schedules: BackendSchedule[], originalSchedules: BackendSchedule[]) => {
    // Validar todos los horarios completados
    let validSchedule = true
    schedules.forEach(oneSchedule => {
        if(!oneSchedule.horaApertura || !oneSchedule.horaCierre) validSchedule = false
    });

    if(!validSchedule) throw new Error("Horarios incompletos");

    //Ejecutar modificación solo en aquellos horarios que fueron modificados
    const modifiedSchedules = schedules.filter((schedule, index) => {
      const original = originalSchedules[index];
      return schedule.horaApertura !== original.horaApertura || schedule.horaCierre !== original.horaCierre;
    });

    if (modifiedSchedules.length === 0) {
      // No hay cambios, no es necesario hacer ninguna petición
      return [];
    }

    // Requests paralelos usando Promise.all
    const promises = modifiedSchedules.map(schedule => 
      fetch(`http://localhost:3000/horarios/update/${schedule.diaSemana}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiJlNTM0YjUyMS1iNzEwLTRhNjQtOGUyOC1iMTZkMTY5ZDVlYjQiLCJlbWFpbCI6InBlcGVAZ21haWwuY29tIiwidGlwb1VzdWFyaW8iOiJBZG1pbmlzdHJhZG9yIiwidXNlcm5hbWUiOiJQZXBlUm9kcmlndWV6MTIzIiwiaWF0IjoxNzU3MjA3Mzc5LCJleHAiOjE3NTc4MTIxNzl9.VxPW6Jkjg4Nm7CeVj-6PD8g6-JJCg3b8T3d8eK_E_dY' 
          // Hardcodeando el jwt, CAMBIAR
        },
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

// Función para actualizar los horarios en el backend
export const saveSchedulesToBackend = async (schedules: BackendSchedule[]) => {
    // Validar todos los horarios completados
    let validSchedule = true
    schedules.forEach(oneSchedule => {
        if(!oneSchedule.horaApertura || !oneSchedule.horaCierre) validSchedule = false
    });

    if(!validSchedule) throw new Error("Horarios incompletos");

    // Requests paralelos usando Promise.all
    const promises = schedules.map(schedule => 
      fetch('http://localhost:3000/horarios/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiJlNTM0YjUyMS1iNzEwLTRhNjQtOGUyOC1iMTZkMTY5ZDVlYjQiLCJlbWFpbCI6InBlcGVAZ21haWwuY29tIiwidGlwb1VzdWFyaW8iOiJBZG1pbmlzdHJhZG9yIiwidXNlcm5hbWUiOiJQZXBlUm9kcmlndWV6MTIzIiwiaWF0IjoxNzU3MjA3Mzc5LCJleHAiOjE3NTc4MTIxNzl9.VxPW6Jkjg4Nm7CeVj-6PD8g6-JJCg3b8T3d8eK_E_dY' 
          // Hardcodeando el jwt, CAMBIAR
        },
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