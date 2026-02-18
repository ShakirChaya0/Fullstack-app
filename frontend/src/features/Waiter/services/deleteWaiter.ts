export default async function deleteWaiter (apiCall: (url: string, options?: RequestInit) => Promise<Response>, id: string): Promise<void> {
    const response = await apiCall(`mozos/id/${id}`, {
        method: "DELETE"
    })
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   

    return 
}