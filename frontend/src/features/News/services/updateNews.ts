import type News from "../interfaces/News"

export default async function updateNews (apiCall: (url: string, options?: RequestInit) => Promise<Response>, data: News): Promise<News> {
    const response = await apiCall(`novedades/${data._newsId}`, {
      method: "PATCH",
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