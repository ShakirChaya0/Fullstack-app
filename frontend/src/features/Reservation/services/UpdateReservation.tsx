import type { StateReservation } from "../interfaces/IReservation"

interface ResToUpadate {
    _reservationId: number 
    _status: StateReservation
    _reserveDate: Date
    _reserveTime: string
    _commensalsNumber: number
}

export default async function UpdateReservation(reserv: ResToUpadate, apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const res = await apiCall(`reservas/estado/${reserv._reservationId}`, {
        method: "PATCH", 
        body: JSON.stringify({ estado: reserv._status })
    });

    if (!res.ok) {
        const content = await res.json();
        throw new Error(`Error: ${content.message}`);
    }

    return;
}
