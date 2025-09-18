interface ReservationCreate {
    _reserveDate: Date, 
    _reserveTime: string,
    _commensalsNumber: number
}

export default async function CreateReservation(newReservation: ReservationCreate) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas`, {
        method: 'POST', 
        headers: { "Content-Type": "application/json", 
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiIzMTgzZTg0Ny05ZjYxLTRkYTQtYjFiNi02NjcyY2I4NzAyNWYiLCJlbWFpbCI6ImZuc0BnbWFpbC5jb20iLCJ0aXBvVXN1YXJpbyI6IkNsaWVudGUiLCJ1c2VybmFtZSI6ImNhYmoiLCJpYXQiOjE3NTgxOTc4NzQsImV4cCI6MTc1ODgwMjY3NH0.e1qFY9qqRvr7pZlbuwg1cuWgUKnqprGjs_BtPV_An_Q",
         },
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