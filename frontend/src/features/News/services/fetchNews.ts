import {type BackResults}  from "../interfaces/News"
import type { FilterProps } from "../pages/NewsCRUD";


export const fetchNews = async (apiCall: (url: string, options?: RequestInit) => Promise<Response>, query: string, filter: FilterProps, page?: number): Promise<BackResults> => {
    const endpoint = query === "" ? `novedades?page=${page}&status=${filter}` : `novedades/title/${query}?page=${page}&status=${filter}`
    const response = await apiCall(endpoint);
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   

    const data = await response.json();

    return data
}