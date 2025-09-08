import type { Waiter } from "../interfaces/Waiters"

export default async function createWaiter (datas: Waiter): Promise<Waiter> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mozos`, {
        method: "POST",
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