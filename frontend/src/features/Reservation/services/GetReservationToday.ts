import type { IReservation } from "../interfaces/IReservation";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export default async function GetReservationToday(page: number, pageSize: number, apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<PaginatedResponse<IReservation>> {
  const hoy = new Date 

  const response = await apiCall(`reservas/mozo/reservaDelDia?today=${hoy}&page=${page}&pageSize=${pageSize}`);

  if(!response.ok) {
    if (response.status === 404) throw new Error("No se encontraron reservas para el día de hoy");
    throw new Error("error");
  }

  const data = await response.json();
  return data;
}