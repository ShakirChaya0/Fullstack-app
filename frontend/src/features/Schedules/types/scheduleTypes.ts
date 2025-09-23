
export interface BackendSchedule {
  diaSemana: number;
  horaApertura: string;
  horaCierre: string;
}

// Interfaz para el JSON que viene del backend (con underscores)
export interface BackendScheduleRaw {
  diaSemana: number;
  _horaApertura: string;
  _horaCierre: string;
}

export interface RegisterAndModifierTableProps {
    schedules: BackendSchedule[];
    updateOpenSchedule: (dayIndex: number, value: string) => void;
    updateCloseSchedule: (dayIndex: number, value: string) => void;
}

export interface useMutationRegistrationProps {
    schedules: BackendSchedule[];
    setError: (value: React.SetStateAction<string>) => void
}

export interface useMutationModificationProps {
    schedules: BackendSchedule[];
    originalSchedule: React.RefObject<BackendSchedule[] | null>
    setError: (value: React.SetStateAction<string>) => void
}