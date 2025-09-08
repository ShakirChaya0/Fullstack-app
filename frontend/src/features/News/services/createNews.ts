import type News from "../interfaces/News";

export default async function createNews (dataNews: News): Promise<News> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: dataNews._title,
        descripcion: dataNews._description,
        fechaInicio: dataNews._startDate,
        fechaFin: dataNews._endDate
      })
    }); 
    
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