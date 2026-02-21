import type {
    ConsolidatedOrderLine,
    OrderLineClientInfo,
} from "../interfaces/Order";

export const getLinesToDelete = (
    originalLines: OrderLineClientInfo[],
    consolidatedOrderLines: ConsolidatedOrderLine[],
) => {
    const linesToDelete: number[] = [];

    // Solo procesar líneas que FUERON consolidadas (Pendiente y Completada)
    const consolidatedStatuses = ["Pendiente", "Terminada"];

    consolidatedOrderLines.forEach((consolidated) => {
        if (!consolidatedStatuses.includes(consolidated.estado)) {
            return; // Saltar líneas no consolidadas (En_Preparacion)
        }

        // Encontrar todas las líneas originales del mismo producto
        const originalLinesForProduct = originalLines.filter(
            (line) =>
                line.nombreProducto === consolidated.nombreProducto &&
                consolidatedStatuses.includes(line.estado) &&
                line.estado === consolidated.estado,
        );

        // Si hay más de una, eliminar todas excepto la primera (que mantiene cantidad consolidada)
        if (originalLinesForProduct.length > 1) {
            originalLinesForProduct.slice(1).forEach((lineToDelete) => {
                linesToDelete.push(lineToDelete.nroLinea!);
            });
        }
    });

    return linesToDelete;
};
