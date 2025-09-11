// Variable de entorno
const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS_URL;

export const getProductsData = async () => {
  const response = await fetch(PRODUCTS_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    // Si es 404, intentar obtener el mensaje del JSON del backend
    if (response.status === 404) {
      try {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'No hay productos cargados');
        error.name = 'NotFoundError';
        throw error;
      } catch {
        // Si no se puede parsear el JSON, usar mensaje por defecto
        const error = new Error('No hay productos cargados');
        error.name = 'NotFoundError';
        throw error;
      }
    }
    // Para otros errores
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

