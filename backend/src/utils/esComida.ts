import { Comida, Bebida, Update, UpdateComida, UpdateBebida } from "../interfaces/productos.js";

export function esComida(producto: Comida | Bebida): producto is Comida {
    return (producto as Comida).tipo !== undefined
}

export function esUpdateComida (data: Update, datos: UpdateComida | UpdateBebida): datos is UpdateComida {
    return data.categoria === "Comida";
}