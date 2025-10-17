export default async function fetchSuggestions (apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const response = await apiCall("sugerencias?filter=ACTIVES")
    if (!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json()
    return data
} 