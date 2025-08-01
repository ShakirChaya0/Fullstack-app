import type { Bebida } from "../interfaces/products"


export const fetchDrinks = async (): Promise<{Drinks: Bebida[]}> => {
    try{
        const response = await fetch("http://localhost:3000/productos/tipoProducto/Bebida");
        if(!response.ok) throw new Error("Error al conseguir los datos")
        const data = await response.json();
        return {
            Drinks: data
        }
    }catch(err){
        console.log(err)
        return {
            Drinks: []
        }
    }
}