import {type BackResults}  from "../interfaces/News"
import type { FilterProps } from "../pages/NewsCRUD";


export const fetchNews = async (apiCall: (url: string, options?: RequestInit) => Promise<Response>, query: string, filter: FilterProps, page?: number): Promise<BackResults> => {
    if (query === ""){
        const response = await apiCall(`novedades?page=${page}&status=${filter}`);
        
        if(!response.ok) throw new Error("Error al conseguir los datos")
    
        const data = await response.json();
    
        return data
    }
    else{
        const response = await apiCall(`novedades/title/${query}?page=${page}&status=${filter}`);
    
        if(!response.ok) throw new Error("Error al conseguir los datos")
        
        const data = await response.json();
    
        return data
    }
}