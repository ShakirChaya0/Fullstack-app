import type { RefObject } from "react"
import type { ProductPriceWithoutID, ProductWithoutPrice } from "../interfaces/product&PriceInterfaces"

// Se implementa paginación desde backend
export const getProductsData = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  page: number, 
  limit: number, 
  search: string
) => {
  let response
  let isNumeric = false // Bandera para manejar respuestas sin formato de paginación (Endpoint busqueda por id)

  console.log('Busqueda:', search)
  
  if (search && search.trim() !== '') {
    if (/^\d+$/.test(search.trim())) { 
      // Es numérico - buscar por ID
      isNumeric = true
      response = await apiCall(`productos/id/${search.trim()}`)
    } else {
      // Es texto - buscar por nombre
      console.log('Búsqueda por nombre:', search.trim())
      response = await apiCall(`productos/nombre/${search.trim()}?page=${page}&limit=${limit}`)
    }
  } else {
    // No hay búsqueda, usar paginación normal
    console.log('Modo paginación:', { page, limit })
    response = await apiCall(`productos?page=${page}&limit=${limit}`)
  }

  if (!response.ok) {
    // Si es 404, intentar obtener el mensaje del JSON del backend
    if (response.status === 404) {
      try {
        const errorData = await response.json()
        const error = new Error(errorData.message || 'No hay productos cargados')
        error.name = 'NotFoundError'
        throw error
      } catch {
        // Si no se puede parsear el JSON, usar mensaje por defecto
        const error = new Error('No hay productos cargados')
        error.name = 'NotFoundError'
        throw error
      }
    }
    // Para otros errores
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  
  // Convertimos la búsqueda individual a formato paginado
  if (isNumeric) {
    // Si es búsqueda por id, convertir a formato paginado
    const products = Array.isArray(data) ? data : [data] // Manejar tanto array como objeto único
    
    return {
      data: products,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: products.length,
        ItemsPerPage: products.length,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }
  
  // Si no es búsqueda por id, ya esta paginado
  return data
}

export const saveProductToBackend = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  newProduct: ProductPriceWithoutID
) => {
  try {
    // Paso 1: Crear el producto
    const productResponse = await apiCall('productos', {
      method: 'POST',
      body: JSON.stringify({
        nombre: newProduct.nombre,
        descripcion: newProduct.descripcion,
        estado: newProduct.estado,
        tipo: newProduct.tipo,
        esSinGluten: newProduct.esSinGluten,
        esVegetariana: newProduct.esVegetariana,
        esVegana: newProduct.esVegana,
        esAlcoholica: newProduct.esAlcoholica
      })
    })

    if (!productResponse.ok) {
      throw new Error(`Error al crear producto: ${productResponse.status} ${productResponse.statusText}`)
    }

    const productData = await productResponse.json()
    
    const productId = productData._productId
    
    if (!productId) {
      throw new Error('No se pudo obtener el ID del producto creado')
    }

    // Paso 2: Registrar el precio usando el ID obtenido
    const priceResponse = await apiCall('precios', {
      method: 'POST',
      body: JSON.stringify({
        idProducto: productId,
        monto: newProduct.precio
      })
    })

    if (!priceResponse.ok) {
      throw new Error(`Error al registrar precio: ${priceResponse.status} ${priceResponse.statusText}`)
    }

    const priceData = await priceResponse.json()

    // Retornar ambos resultados
    return {
      product: productData,
      price: priceData
    }

  } catch (error) {
    console.error('Error en saveProductToBackend:', error)
    throw error
  }
}

export const modifyProductToBackend = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  newModification: ProductWithoutPrice, 
  productBefModification: RefObject<ProductWithoutPrice | null>
) => {
  if(productBefModification.current === null) throw new Error('Error con el producto original') //No debería dispararse en ninguna situación
  
  const valuesToModify = {
    nombre: newModification.nombre !== productBefModification.current.nombre ? newModification.nombre : undefined,
    descripcion: newModification.descripcion !== productBefModification.current.descripcion ? newModification.descripcion : undefined,
    estado: newModification.estado !== productBefModification.current.estado ? newModification.estado : undefined,
    tipo: newModification.tipo !== productBefModification.current.tipo ? newModification.tipo : undefined,
    esSinGluten: newModification.esSinGluten !== productBefModification.current.esSinGluten ? newModification.esSinGluten : undefined,
    esVegetariana: newModification.esVegetariana !== productBefModification.current.esVegetariana ? newModification.esVegetariana : undefined,
    esVegana: newModification.esVegana !== productBefModification.current.esVegana ? newModification.esVegana : undefined,
    esAlcoholica: newModification.esAlcoholica !== productBefModification.current.esAlcoholica ? newModification.esAlcoholica : undefined
  }

  const response = await apiCall(`productos/${newModification.idProducto}`, {
    method: 'PATCH',
    body: JSON.stringify(valuesToModify)
  })

  if (!response.ok) {
    // Si es 404, intentar obtener el mensaje del JSON del backend
    if (response.status === 404) {
      try {
        const errorData = await response.json()
        const error = new Error(errorData.message || 'Error al registrar el cambio')
        error.name = 'NotFoundError'
        throw error
      } catch {
        // Si no se puede parsear el JSON, usar mensaje por defecto
        const error = new Error('Error al registrar el cambio')
        error.name = 'NotFoundError'
        throw error
      }
    }
    // Para otros errores
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export const getPriceData = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  productId: string
) => {
  const response = await apiCall(`precios/producto/${productId}`)

  if (!response.ok) {
    // Si es 404, intentar obtener el mensaje del JSON del backend
    if (response.status === 404) {
      try {
        const errorData = await response.json()
        const error = new Error(errorData.message || `No hay precios cargados para el producto ${productId}`)
        error.name = 'NotFoundError'
        throw error
      } catch {
        // Si no se puede parsear el JSON, usar mensaje por defecto
        const error = new Error(`No hay precios cargados para el producto ${productId}`)
        error.name = 'NotFoundError'
        throw error
      }
    }
    // Para otros errores
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export const savePriceToBackend = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  newPrice: {idProducto: string, monto: number}
) => {
  const requestBody = {
    idProducto: parseInt(newPrice.idProducto),
    monto: newPrice.monto
  }

  const response = await apiCall('precios', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  })
  
  if (!response.ok) {
    // Intentar obtener más información del error
    try {
      const errorData = await response.json()
      throw new Error(`Error al registrar precio: ${response.status} - ${JSON.stringify(errorData)}`)
    } catch {
      throw new Error(`Error al registrar precio: ${response.status} ${response.statusText}`)
    }
  }
  return response.json()
}

export const deletePrice = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  idProducto: string, 
  fechaActual: string
) => {
  const response = await apiCall(`precios?idProducto=${idProducto}&fechaActual=${fechaActual}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    // Intentar obtener más información del error
    try {
      const errorData = await response.json()
      throw new Error(`Error al eliminar precio: ${response.status} - ${JSON.stringify(errorData)}`)
    } catch {
      throw new Error(`Error al eliminar precio: ${response.status} ${response.statusText}`)
    }
  }

  // Verificar si hay contenido en la respuesta antes de intentar parsear JSON
  const contentType = response.headers.get('content-type')
  const hasContent = contentType && contentType.includes('application/json')
  
  if (hasContent) {
    try {
      return await response.json()
    } catch {
      // Si no se puede parsear JSON, retornar un objeto de éxito por defecto
      return { success: true, message: 'Precio eliminado correctamente' }
    }
  } else {
    // No hay contenido JSON, pero la eliminación fue exitosa
    return { success: true, message: 'Precio eliminado correctamente' }
  }
}