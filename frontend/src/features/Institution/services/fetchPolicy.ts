import type Policy from "../interfaces/Policy";


export const fetchPolicy = async (): Promise<Policy> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/politicas`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}