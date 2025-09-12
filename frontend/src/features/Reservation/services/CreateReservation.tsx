interface ReservationCreate {
    _reserveDate : Date, 
    _reserveTime : string,
    _commensalsNumber: number
}

function formatDateToDDMMYYYY(date: Date): string {
  return new Intl.DateTimeFormat('es-AR').format(date);
}

export default async function CreateReservation(newReservation: ReservationCreate) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas`, {
        method: 'POST', 
        headers: { "Content-Type": "application/json", 
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiI1YmExYjJiYy0yMzUzLTQyOTktYmI3Zi1kMDYzNjYzYjQ1MDYiLCJlbWFpbCI6ImZuc0BnbWFpbC5jb20iLCJ0aXBvVXN1YXJpbyI6IkNsaWVudGUiLCJ1c2VybmFtZSI6ImNhYmoiLCJpYXQiOjE3NTc2MjQzMjcsImV4cCI6MTc1ODIyOTEyN30.gm9OUAjGUe4hPenB5LxlvPEsgIapLP0R3hXeCOAf1V0",
         },
        body: JSON.stringify({
            reservationDate: formatDateToDDMMYYYY(newReservation._reserveDate),
            reserveTime: newReservation._reserveTime,
            commensalsNumebr: newReservation._commensalsNumber
        })
    });

    if (!res.ok) {
        if (res.status === 409) throw new Error("Ya realizo una reserva para esa fecha y hora");
        throw new Error("error")
    }

    const data = await res.json();
    
    return data;
}