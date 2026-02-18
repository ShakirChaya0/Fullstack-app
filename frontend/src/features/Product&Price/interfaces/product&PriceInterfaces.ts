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

// Interfaz para el get all sin paginar
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

// interfaz para el get all paginado
export interface ProductPriceFromBackendPaginated {
  data: {
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
  }[],
  pagination: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    ItemsPerPage: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}

export interface ProductPricePaginated {
  productos: {
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
  }[],
  paginacion: {
    paginaActual: number,
    paginaTotales: number,
    itemsTotales: number,
    itemsPorPagina: number,
    proxPagina: boolean,
    antePagina: boolean
  }
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

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
}

export interface SearchProductsProps {
  filtersToSearch: string;
  updateFilter: (key: string, value: string) => void;
}

export interface FiltersProductsProps {
  filterType: string;
  filterState: string;
  filtersFoodType: string; 
  filtersFoodSpec: string;
  filtersDrinkSpec: string;
  updateFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export interface ProductCardsProps {
  filteredProducts: ProductPrice[];
  handleOpenModifyModal: (product: ProductPrice) => void
}

export interface ModifyProductModalProps {
  isOpen: boolean; 
  product: ProductPrice; 
  onClose: () => void;
  currentPage?: number;
  limit?: number;
  search?: string;
}

export interface TablePriceProps {
  priceList: PriceList[]; 
  onDeletePrice: (price: PriceList) => void;
}

export interface NewPriceModalProps {
  idProducto: string;
  preciosRegistrados: PriceList[]
}

export interface DeleteConfirmationModalProps {
  idProducto: string;
  selectedPrice: PriceList | null;
  amountPrices: number
}

export interface ProductTogglerModificationProps {
  product: ProductPrice; 
  newProduct: ProductWithoutPrice;
  setNewProduct: (value: React.SetStateAction<ProductWithoutPrice>) => void;
}

export interface ProductTogglerRegistrationProps {
  productType: ProductType | undefined; 
  setProductType: (value: React.SetStateAction<ProductType | undefined>) => void; 
  newProduct: ProductPriceWithoutID; 
  setNewProduct: (value: React.SetStateAction<ProductPriceWithoutID>) => void;
}