import type { Waiter } from "../interfaces/Waiters"

export default async function createWaiter (apiCall: (url: string, options?: RequestInit) => Promise<Response>, datas: Waiter): Promise<Waiter> {
    const response = await apiCall(`mozos`, {
        method: "POST",
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
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   

    const data = await response.json()
    return data
}