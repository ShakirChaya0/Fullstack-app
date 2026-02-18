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
    // Intentamos leer el JSON del backend
    let msg = "Ocurrió un error al crear la reserva";
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch (e) {
      console.error("No se pudo parsear el mensaje del backend", e);
    }

    throw new Error(msg);
  }

    const data = await res.json();
    
    return data;
}