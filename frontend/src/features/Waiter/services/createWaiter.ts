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
    
    if(!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message
        switch(response.status){
            case 409:
                throw new Error(errorMessage)
            case 503:
                throw new Error(errorMessage)
        }
    }

    const data = await response.json()
    return data
}