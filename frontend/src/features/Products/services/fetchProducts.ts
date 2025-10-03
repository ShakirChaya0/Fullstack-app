export default async function fetchProducts (apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const response = await apiCall("productos")

    if (!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}