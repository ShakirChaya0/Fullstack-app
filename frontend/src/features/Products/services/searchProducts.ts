interface Product {
    _productId: number;
    _name: string;
    _description: string;
}

export async function searchProducts(apiCall: (url: string, options?: RequestInit) => Promise<Response>, nombre: string): Promise<Product[]> {
    if (!nombre) return [];
    const res = await apiCall(`productos/nombre/${nombre}`);

    if (!res.ok) throw new Error("Error buscando productos");
    
    return res.json();
}