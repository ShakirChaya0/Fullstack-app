import type { StateReservation } from "../interfaces/IReservation"

interface ResToUpadate {
    _reservationId: number 
    _status: StateReservation
    _reserveDate: Date
    _reserveTime: string
    _commensalsNumber: number
}

export default async function UpdateReservation(reserv: ResToUpadate) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas/estado/${reserv._reservationId}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json", 
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiIzMTgzZTg0Ny05ZjYxLTRkYTQtYjFiNi02NjcyY2I4NzAyNWYiLCJlbWFpbCI6ImZuc0BnbWFpbC5jb20iLCJ0aXBvVXN1YXJpbyI6IkNsaWVudGUiLCJ1c2VybmFtZSI6ImNhYmoiLCJpYXQiOjE3NTgxOTc4NzQsImV4cCI6MTc1ODgwMjY3NH0.e1qFY9qqRvr7pZlbuwg1cuWgUKnqprGjs_BtPV_An_Q",
         },
         body: JSON.stringify({ estado: reserv._status })
    });

        if (!res.ok) {
        if (res.status === 409) throw new Error("Ya existe una sugerencia para ese producto y esa fecha desde");
        throw new Error("error");
    }

    return;
}

