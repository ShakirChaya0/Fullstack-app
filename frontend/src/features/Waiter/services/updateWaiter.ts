import type { Waiter } from "../interfaces/Waiters"

export default async function updateWaiter (apiCall: (url: string, options?: RequestInit) => Promise<Response>, datas: Waiter): Promise<Waiter> {
    const body = Object.fromEntries(
      Object.entries(datas).filter(([, value]) => value !== "")
    );

    const response = await apiCall(`mozos/id/${datas.idMozo}`, {
        method: "PATCH",
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