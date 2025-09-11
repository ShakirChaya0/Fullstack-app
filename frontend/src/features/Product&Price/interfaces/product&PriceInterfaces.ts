import type { FoodType, ProductStatus } from "../types/product&PriceTypes"

export interface ProductPrice {
  idProducto: string
  nombre: string
  descripcion: string
  estado: ProductStatus
  precio: number
  // Propiedades específicas de comida
  esSinGluten?: boolean
  esVegetariana?: boolean
  esVegana?: boolean
  tipo?: FoodType
  // Propiedades específicas de bebida
  esAlcoholica?: boolean
}

export interface ProductPriceFromBackend {
  _productId: string
  _name: string
  _description: string
  _state: ProductStatus
  _price: number
  // Propiedades específicas de comida
  _isGlutenFree?: boolean
  _isVegetarian?: boolean
  _isVegan?: boolean
  _type?: FoodType
  // Propiedades específicas de bebida
  _isAlcoholic?: boolean
}


/* 
{
  "_productId": 5,
  "_name": "Pan con TACC real",
  "_description": "Pan con TACC y harina",
  "_state": "Disponible",
  "_price": 0,
  "_isVegetarian": true,
  "_isVegan": true,
  "_isGlutenFree": false,
  "_type": "Plato_Principal"
} 
  */