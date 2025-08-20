import type { Comida } from "../interfaces/products"


export const fetchFoods = async (): Promise<{Foods: Comida[]}> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/productos/tipoProducto/Comida`);
    
    if(!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json();
    return {
        Foods: data
    }
}