export interface ProductsInterface {
    readonly idProducto: number,
    nombre: string,
    descripcion: string,
    estado: EstadoComida
}

export type TipoComida = "Entrada" | "Plato Principal" | "Postre"
type EstadoComida = "Disponible" | "No Disponible"
type Categoria = "Comida" | "Bebida"


export interface Comida extends ProductsInterface {
    tipo: TipoComida,
    esSinGluten?: boolean,
    esVegana?: boolean,
    esVegetariana?: boolean
}

export interface Bebida extends ProductsInterface {
    esAlcoholica?: boolean
}