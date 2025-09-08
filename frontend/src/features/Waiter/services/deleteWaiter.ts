export default async function deleteWaiter (id: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mozos/id/${id}`, {
        method: "DELETE"
    })
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    return 
}