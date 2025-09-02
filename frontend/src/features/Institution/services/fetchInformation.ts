import type Information from "../interfaces/Information";



export const fetchInformation = async (): Promise<Information> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/informacion`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}