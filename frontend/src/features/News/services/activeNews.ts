export default async function activeNews (apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const response = await apiCall("novedades/actives")

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   

    const data = await response.json();

    return data
}