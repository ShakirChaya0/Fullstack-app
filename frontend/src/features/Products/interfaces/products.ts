export interface ProductsInterface {
    readonly _productId: number,
    _name: string,
    _description: string,
    _state: EstadoComida,
    _price: number
}

export type TipoComida = "Entrada" | "Plato_Principal" | "Postre"
type EstadoComida = "Disponible" | "No Disponible"


export interface Comida extends ProductsInterface {
    _type: TipoComida,
    _isGlutenFree: boolean,
    _isVegan: boolean,
    _isVegetarian: boolean
}

export interface Bebida extends ProductsInterface {
    _isAlcoholic: boolean
}