export async function requestProductInfo (
    apiCall: (url: string, options?: RequestInit) => Promise<Response>, 
    productName: string
) {
    const response = await apiCall(`productos/nombre/${productName}`)

    if (!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data[0]
}