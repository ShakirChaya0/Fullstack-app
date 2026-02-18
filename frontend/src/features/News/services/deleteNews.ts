export async function deleteNews(apiCall: (url: string, options?: RequestInit) => Promise<Response>, id: number): Promise<void> {
  const response = await apiCall(`novedades/${id}`, { method: "DELETE" })
  
  if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
  }   
  
  if (response.status === 204) {
    return 
  }

  const data = await response.json() 

  return data
}