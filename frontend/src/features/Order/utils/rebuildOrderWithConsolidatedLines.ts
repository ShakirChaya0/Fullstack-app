import type {
    ConsolidatedOrderLine,
    LineaPedido,
    Pedido,
} from "../interfaces/Order";
import type { OrderLineStatus } from "../../KitchenOrders/types/SharedTypes";

const findMatchingPreviousLine = (
    consolidatedLine: ConsolidatedOrderLine,
    previousOrderLines: LineaPedido[],
) => {
    // Primero intentar match exacto: nombre + estado
    const exactMatch = previousOrderLines.find(
        (prevLine) =>
            prevLine.producto._name === consolidatedLine.nombreProducto &&
            prevLine.estado === consolidatedLine.estado,
    );
    if (exactMatch) return exactMatch;

    // Fallback: solo por nombre (caso de línea nueva que no existía antes)
    return previousOrderLines.find(
        (prevLine) =>
            prevLine.producto._name === consolidatedLine.nombreProducto,
    );
};

export const rebuildOrderWithConsolidatedLines = (
    previousOrder: Pedido,
    consolidatedOrderLines: ConsolidatedOrderLine[],
): Pedido => {
    const newOrderLines: LineaPedido[] = [];

    consolidatedOrderLines.forEach((consolidatedLine) => {
        const matchingPrevLine = findMatchingPreviousLine(
            consolidatedLine,
            previousOrder.lineasPedido,
        );

        if (matchingPrevLine) {
            newOrderLines.push({
                ...matchingPrevLine,
                // Sincronizamos lineNumbers con nroLineas del backend (array)
                lineNumbers: consolidatedLine.nroLineas,
                cantidad: consolidatedLine.cantidad,
                estado: consolidatedLine.estado as OrderLineStatus,
                subtotal:
                    matchingPrevLine.producto._price *
                    consolidatedLine.cantidad,
            });
        } else {
            // Si no encuentra coincidencia, advertencia (no debería ocurrir)
            console.warn(
                `No se encontró línea previa para: ${consolidatedLine.nombreProducto}`,
            );
        }
    });

    return {
        ...previousOrder,
        lineasPedido: newOrderLines,
    };
};
