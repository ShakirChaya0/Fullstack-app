interface Product {
    _productId: number;
    _name: string;
    _description: string;
}

export async function searchProducts(nombre: string): Promise<Product[]> {
    if (!nombre) return [];
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/productos/nombre/${nombre}`);

    if (!res.ok) throw new Error("Error buscando productos");
    
    return res.json();
}