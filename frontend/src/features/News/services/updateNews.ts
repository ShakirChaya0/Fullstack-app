import type News from "../interfaces/News"

export default async function updateNews (data: News): Promise<News> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades/${data._newsId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: data._title,
        descripcion: data._description,
        fechaInicio: data._startDate,
        fechaFin: data._endDate
      })
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
    
    const datas = await response.json()

    return datas
}