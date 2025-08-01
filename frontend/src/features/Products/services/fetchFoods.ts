import type { Comida } from "../interfaces/products"


export const fetchFoods = async (): Promise<{Foods: Comida[]}> => {
    try{
        const response = await fetch("http://localhost:3000/productos/tipoProducto/Comida");
        if(!response.ok) throw new Error("Error al conseguir los datos")
        const data = await response.json();
        return {
            Foods: data
        }
    }catch(err){
        console.log(err)
        return {
            Foods: []
        }
    }
}