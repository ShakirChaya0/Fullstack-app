export async function deleteNews(id: number): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades/${id}`, { method: "DELETE" })
  
  if (!response.ok) throw new Error("Error al eliminar noticia")
  
  if (response.status === 204) {
    return 
  }

  const data = await response.json() 

  return data
}