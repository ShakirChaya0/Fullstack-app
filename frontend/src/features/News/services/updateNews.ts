import type News from "../interfaces/News"

export default async function updateNews (data: News) {
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
    if(!response.ok) throw new Error("Error")
    return
}