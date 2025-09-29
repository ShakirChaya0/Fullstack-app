interface ReservationCreate {
    _reserveDate: Date, 
    _reserveTime: string,
    _commensalsNumber: number
}

export default async function CreateReservation(newReservation: ReservationCreate, apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const res = await apiCall("reservas", {
        method: 'POST', 
        body: JSON.stringify({
            reserveDate: newReservation._reserveDate,
            reserveTime: newReservation._reserveTime,
            commensalsNumber: newReservation._commensalsNumber
        })
    });

    if (!res.ok) {
        if (res.status === 409) throw new Error("Ya realizo una reserva para esa fecha y hora");
        throw new Error("error")
    }

    const data = await res.json();
    
    return data;
}