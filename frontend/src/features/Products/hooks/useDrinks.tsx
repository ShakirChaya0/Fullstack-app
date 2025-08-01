import { useEffect, useState } from "react";
import type { Bebida } from "../interfaces/products";

export function useDrinks () {
    const [foods, setFoods] = useState<Bebida[]>([]);
    useEffect(() => {
        (async () => {
        try{
            const response = await fetch("http://localhost:3000/productos/tipoProducto/Bebida")
            const data = await response.json();
            setFoods(data)
        }catch(error){
            console.log(error)
        }
    })()
    }, [])
    return foods
}