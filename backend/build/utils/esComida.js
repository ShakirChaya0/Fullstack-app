export function esComida(producto) {
    return producto.tipo !== undefined;
}
export function esUpdateComida(data, datos) {
    return data.categoria === "Comida";
}
