import type { RefObject } from "react"
import type { FoodType, ProductStatus, ProductType } from "../types/product&PriceTypes"

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

export interface ProductPriceWithoutID { //Para la creación
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

export interface ProductWithoutPrice { //Para la modificación
  idProducto: string
  nombre: string
  descripcion: string
  estado: ProductStatus
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

export interface PriceFromBackend {
  _product: {
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
  _dateFrom: string
  _amount: number
}

export interface PriceList {
  producto: {
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
  fechaVigencia: string
  monto: number
}

export interface useMutationProductRegistrationProps {
  newProduct: ProductPriceWithoutID
  setNewProduct: (value: React.SetStateAction<ProductPriceWithoutID>) => void
  setProductType: (value: React.SetStateAction<ProductType | undefined>) => void
  setModalError: (value: React.SetStateAction<string>) => void
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void
}

export interface useMutationProductModificationProps {
  newProduct: ProductWithoutPrice
  productBefModification: RefObject<ProductWithoutPrice | null>
  setModalError: (value: React.SetStateAction<string>) => void
  onClose: () => void
}

export interface useMutationPriceRegistrationProps {
  newPrice: {
    idProducto: string
    monto: number
  }
  setNewPrice: (value: React.SetStateAction<{
    idProducto: string
    monto: number
  }>) => void
  setModalError: (value: React.SetStateAction<string>) => void
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void
}

export interface useMutationDeletePriceProps {
  idProducto: string
  selectedPrice: PriceList | null
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void
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