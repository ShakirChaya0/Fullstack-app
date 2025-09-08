import type { BackResults } from "../interfaces/Waiters"

export default async function fetchWaiters (page: number, query: string): Promise<BackResults> {
    const endpoint = query.length !== 0 ? `/nombre/${query}?page=${page}` : `?page=${page}`;
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mozos${endpoint}`)
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json()
    return data
}