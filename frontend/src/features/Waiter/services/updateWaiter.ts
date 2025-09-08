import type { Waiter } from "../interfaces/Waiters"

export default async function updateWaiter (datas: Waiter): Promise<Waiter> {
    const body = Object.fromEntries(
      Object.entries(datas).filter(([, value]) => value !== "")
    );

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mozos/id/${datas.idMozo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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