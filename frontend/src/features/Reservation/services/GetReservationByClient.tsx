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


export default async function GetReservationByClient(page: number, pageSize: number): Promise<PaginatedResponse<IReservation>> {
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas/cliente/historial?page=${page}&pageSize=${pageSize}`, {
        method: "GET", 
        headers : {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiIzMTgzZTg0Ny05ZjYxLTRkYTQtYjFiNi02NjcyY2I4NzAyNWYiLCJlbWFpbCI6ImZuc0BnbWFpbC5jb20iLCJ0aXBvVXN1YXJpbyI6IkNsaWVudGUiLCJ1c2VybmFtZSI6ImNhYmoiLCJpYXQiOjE3NTgxOTc4NzQsImV4cCI6MTc1ODgwMjY3NH0.e1qFY9qqRvr7pZlbuwg1cuWgUKnqprGjs_BtPV_An_Q",
            }
        }
    )

    if(!response.ok) {
        if (response.status === 404) throw new Error("No se encontraron reservas para el cliente");
        throw new Error("error")
    }

    const data = await response.json();
    return data;
}