import type { StateReservation } from "../interfaces/IReservation"

interface ResToUpadate {
    _reservationId: number; 
    _status:StateReservation;
    _reserveDate : Date;
    _reserveTime : string
    _commensalsNumber: number
}

export default async function UpdateReservation(reserv: ResToUpadate) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas/estado/${reserv._reservationId}?estado=${reserv._status}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }
    });

        if (!res.ok) {
        if (res.status === 409) throw new Error("Ya existe una sugerencia para ese producto y esa fecha desde");
        throw new Error("error");
    }

    return;
}

