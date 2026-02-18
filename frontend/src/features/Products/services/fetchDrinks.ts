import type { Bebida } from "../interfaces/products"

export const fetchDrinks = async (apiCall: (url: string, options?: RequestInit) => Promise<Response>) : Promise<{Drinks: Bebida[]}> => {
    const response = await apiCall(`productos/tipoProducto/Bebida`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();
    return {
        Drinks: data
    }
}