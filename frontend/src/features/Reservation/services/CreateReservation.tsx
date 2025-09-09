interface ReservationCreate {
    _reserveDate : Date, 
    _reserveTime : string,
    _commensalsNumber: number
}

export default async function CreateReservation(newReservation: ReservationCreate) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas`, {
        method: 'POST', 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            reservationDate: newReservation._reserveDate,
            reserveTime: newReservation._reserveDate,
            commensalsNumebr: newReservation._commensalsNumber
        })
    });

    if (!res.ok) {
        if (res.status === 409) throw new Error("Ya existe una sugerencia para ese producto y esa fecha desde");
        throw new Error("error")
    }

    const data = await res.json();
    
    return data;
}