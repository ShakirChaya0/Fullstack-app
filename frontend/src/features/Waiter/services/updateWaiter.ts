import type { Waiter } from "../interfaces/Waiters"

export default async function updateWaiter (datas: Waiter): Promise<Waiter> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mozos/id/${datas.idMozo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreUsuario: datas.nombreUsuario,
          contrasenia: datas.contrasenia,
          nombre: datas.nombre,
          apellido: datas.apellido,
          dni: datas.dni,
          telefono: datas.telefono,
          email: datas.email
        })
    })
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json()
    return data
}