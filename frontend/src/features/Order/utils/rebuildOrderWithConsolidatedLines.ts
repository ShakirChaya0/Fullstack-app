import type { OrderLineClientInfo, Pedido } from "../interfaces/Order";

const findMatchingPreviousLine = (
    consolidatedLine: OrderLineClientInfo,
    previousOrderLines: any[]
) => {
    return previousOrderLines.find(prevLine => 
        prevLine.producto._name === consolidatedLine.nombreProducto
    );
};

export const rebuildOrderWithConsolidatedLines = (
    previousOrder: Pedido,
    consolidatedOrderLines: OrderLineClientInfo[]
) => {
    const newOrderLines = consolidatedOrderLines.map(consolidatedLine => {
        const matchingPrevLine = findMatchingPreviousLine(
            consolidatedLine,
            previousOrder.lineasPedido
        );

        if (matchingPrevLine) {
            return {
                ...matchingPrevLine,
                cantidad: consolidatedLine.cantidad,
                estado: consolidatedLine.estado,
                subtotal: matchingPrevLine.producto._price * consolidatedLine.cantidad,
            };
        }
        
        // Si no encuentra coincidencia, advertencia (no debería ocurrir)
        console.warn(`No se encontró línea previa para: ${consolidatedLine.nombreProducto}`);
        return null;
    }).filter(line => line !== null);

    return {
        ...previousOrder,
        lineasPedido: newOrderLines
    };
};