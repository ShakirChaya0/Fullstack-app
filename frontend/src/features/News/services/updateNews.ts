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

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   
    
    const datas = await response.json()

    return datas
}