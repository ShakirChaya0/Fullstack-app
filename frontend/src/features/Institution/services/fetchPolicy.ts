import type Policy from "../interfaces/Policy";

export const fetchPolicy = async (apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<Policy> => {
    const response = await apiCall(`politicas`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}