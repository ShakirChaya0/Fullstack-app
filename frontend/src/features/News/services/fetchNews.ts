import {type BackResults}  from "../interfaces/News"


export const fetchNews = async (page?: number): Promise<BackResults> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades?page=${page}`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}