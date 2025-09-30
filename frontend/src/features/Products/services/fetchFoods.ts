import type { Comida } from "../interfaces/products"


export const fetchFoods = async (apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<{Foods: Comida[]}> => {
    const response = await apiCall(`productos/tipoProducto/Comida`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();
    return {
        Foods: data
    }
}