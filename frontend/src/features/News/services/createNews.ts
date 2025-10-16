import type News from "../interfaces/News";

export default async function createNews (apiCall: (url: string, options?: RequestInit) => Promise<Response>, dataNews: News): Promise<News> {
    const response = await apiCall(`novedades`, {
      method: "POST",
      body: JSON.stringify({
        titulo: dataNews._title,
        descripcion: dataNews._description,
        fechaInicio: dataNews._startDate,
        fechaFin: dataNews._endDate
      })
    }); 
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   
    
    const data = await response.json()
    
    return data
}