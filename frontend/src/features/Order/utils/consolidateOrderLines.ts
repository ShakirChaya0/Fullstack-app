import type {
    ConsolidatedOrderLine,
    OrderLineClientInfo,
} from "../interfaces/Order";

export const consolidateOrderLines = (
    orderLines: OrderLineClientInfo[],
): ConsolidatedOrderLine[] => {
    const consolidatedMap = new Map<string, ConsolidatedOrderLine>();
    const nonConsolidatedLines: ConsolidatedOrderLine[] = [];

    orderLines.forEach((line) => {
        // Solo consolidar Pendiente y Completada
        const shouldConsolidate =
            line.estado === "Pendiente" || line.estado === "Terminada";

        if (!shouldConsolidate) {
            // En_Preparacion y otros estados: no consolidar, pero guardar nroLineas
            nonConsolidatedLines.push({
                ...line,
                nroLineas: line.nroLinea !== undefined ? [line.nroLinea] : [],
            });
            return;
        }

        // Para Pendiente y Terminada, consolidar normalmente
        const key = `${line.nombreProducto}_${line.estado}`;

        if (consolidatedMap.has(key)) {
            const existingLine = consolidatedMap.get(key)!;
            // Acumulamos todos los nroLinea en el array
            if (line.nroLinea !== undefined) {
                existingLine.nroLineas.push(line.nroLinea);
            }
            // Cantidad = SUMA de todas las cantidades reales
            existingLine.cantidad += line.cantidad;
        } else {
            consolidatedMap.set(key, {
                ...line,
                nroLineas: line.nroLinea !== undefined ? [line.nroLinea] : [],
                cantidad: line.cantidad, // Iniciar cantidad con la cantidad real de la línea
            });
        }
    });

    return [...Array.from(consolidatedMap.values()), ...nonConsolidatedLines];
};
