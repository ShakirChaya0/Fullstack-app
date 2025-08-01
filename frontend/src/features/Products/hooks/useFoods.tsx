import { useEffect, useState } from "react";
import type { Comida } from "../interfaces/products";

export function useFoods () {
    const [foods, setFoods] = useState<Comida[]>([]);
    useEffect(() => {
        (async () => {
        try{
            const response = await fetch("http://localhost:3000/productos/tipoProducto/Comida")
            const data = await response.json();
            setFoods(data)
        }catch(error){
            console.log(error)
        }
    })()
    }, [])
    return foods
}