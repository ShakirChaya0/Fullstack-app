import type Information from "../interfaces/Information";

export const fetchInformation = async (apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<Information> => {
    const response = await apiCall(`informacion`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();

    return data
}