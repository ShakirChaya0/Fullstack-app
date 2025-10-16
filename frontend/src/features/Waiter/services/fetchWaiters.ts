import type { BackResults } from "../interfaces/Waiters"

export default async function fetchWaiters (apiCall: (url: string, options?: RequestInit) => Promise<Response>, page: number, query: string): Promise<BackResults> {
    const endpoint = query.length !== 0 ? `/nombre/${query}?page=${page}` : `?page=${page}`;
    
    const response = await apiCall(`mozos${endpoint}`)
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   

    const data = await response.json()
    return data
}