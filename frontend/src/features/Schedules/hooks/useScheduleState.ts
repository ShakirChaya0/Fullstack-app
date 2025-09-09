import { useState, useEffect, useRef } from "react";
import { completeSchedule } from "../utils/completeSchedule";
import type { BackendSchedule, BackendScheduleRaw } from "../types/scheduleTypes";
import { days } from "../constants/scheduleConstants";

// Función para ordenar y normalizar horarios del backend
export const sortAndNormalizeSchedules = (rawSchedules: BackendScheduleRaw[]): BackendSchedule[] => {
  return rawSchedules
    // Primero ordenamos por día de semana (0=Domingo, 1=Lunes, etc.)
    .sort((a, b) => a.diaSemana - b.diaSemana)
    // Luego normalizamos los nombres de propiedades (quitar underscores)
    .map(schedule => ({
      diaSemana: schedule.diaSemana,
      horaApertura: schedule._horaApertura,
      horaCierre: schedule._horaCierre
    }));
};

// Custom hook que encapsula toda la lógica del estado de horarios modificar
export const useScheduleStateModify = (backendSchedules?: BackendScheduleRaw[]) => {

  // useRef para almacenar los datos originales del backend 
  const originalSchedule = useRef<BackendSchedule[] | null>(null);
  
  // Estado local - inicializado con valores por defecto primero
  const [schedules, setSchedules] = useState<BackendSchedule[]>(() => {
    const defaultSchedules: BackendSchedule[] = [];
    for (let index = 0; index < 7; index++) {
      defaultSchedules.push({
        diaSemana: index,
        horaApertura: "00:00",
        horaCierre: "00:00"
      });
    }
    return defaultSchedules;
  });
  
  const [error, setError] = useState<string>("");

  // useEffect para sincronizar con datos del backend cuando llegan
  useEffect(() => {
    if (backendSchedules && backendSchedules.length > 0) {
      const correctSchedule = sortAndNormalizeSchedules(backendSchedules);
      
      // guardando una copia de los datos del backend solo en la primer llamada del useQuery
      if (originalSchedule.current === null) {
        originalSchedule.current = JSON.parse(JSON.stringify(correctSchedule));
      }
      
      setSchedules(correctSchedule);
    }
  }, [backendSchedules]);

  // Función para actualizar horario específico
  const updateOpenSchedule = (dayIndex: number, value: string) => {
    setSchedules(prev => {
      const newSchedules = [...prev];
      newSchedules[dayIndex].horaApertura = value
      if(completeSchedule(newSchedules)) setError("") //Se limpia el error si se actualizó el valor incompleto
      return newSchedules;
    });
  }

  const updateCloseSchedule = (dayIndex: number, value: string) => {
    setSchedules(prev => {
      const newSchedules = [...prev];
      newSchedules[dayIndex].horaCierre = value
      if(completeSchedule(newSchedules)) setError("") //Se limpia el error si se actualizó el valor incompleto
      return newSchedules;
    });
  }

  return {
    schedules,
    originalSchedule,
    updateOpenSchedule,
    updateCloseSchedule,
    error,
    setError,
    days
  };
};

// Custom hook que encapsula toda la lógica del estado de horarios registro
export const useScheduleStateRegister = () => {

  // Estado local - inicializado con valores por defecto primero
  const [schedules, setSchedules] = useState<BackendSchedule[]>(() => {
    const defaultSchedules: BackendSchedule[] = [];
    for (let index = 0; index < 7; index++) {
      defaultSchedules.push({
        diaSemana: index,
        horaApertura: "00:00",
        horaCierre: "00:00"
      });
    }
    return defaultSchedules;
  });
  
  const [error, setError] = useState<string>("");

  const updateOpenSchedule = (dayIndex: number, value: string) => {
    setSchedules(prev => {
      const newSchedules = [...prev];
      newSchedules[dayIndex].horaApertura = value
      if(completeSchedule(newSchedules)) setError("") //Se limpia el error si se actualizó el valor incompleto
      return newSchedules;
    });
  }

  const updateCloseSchedule = (dayIndex: number, value: string) => {
    setSchedules(prev => {
      const newSchedules = [...prev];
      newSchedules[dayIndex].horaCierre = value
      if(completeSchedule(newSchedules)) setError("") //Se limpia el error si se actualizó el valor incompleto
      return newSchedules;
    });
  }

  return {
    schedules,
    updateOpenSchedule,
    updateCloseSchedule,
    error,
    setError,
    days
  };

};