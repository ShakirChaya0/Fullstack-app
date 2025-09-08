interface SuggToUpdate {
    _previousProductId: number,
    _previousDateFrom: Date,
    _product: { _productId: number; _name: string; _description: string },
    _dateFrom: string,
    _dateTo: string
}

export default async function updateSuggestion(sugg: SuggToUpdate) {
    const query = `idProducto=${sugg._previousProductId}&fechaDesde=${sugg._previousDateFrom}`;
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sugerencias?${query}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idProducto: sugg._product._productId,
            fechaDesde: sugg._dateFrom,
            fechaHasta: sugg._dateTo
        })
    });

    if (!response.ok) {
        if (response.status === 409) throw new Error("Ya existe una sugerencia para ese producto y esa fecha desde");
        throw new Error("error")
    }
    
    return
}