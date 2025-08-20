import type  News  from "../interfaces/News"


export const fetchNews = async (): Promise<{News: News[]}> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();
    return {
        News: data
    }
}