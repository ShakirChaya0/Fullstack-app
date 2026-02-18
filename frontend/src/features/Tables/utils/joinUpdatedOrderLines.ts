import type { LineaPedido, PedidoBackend } from "../interfaces/OrderTable";

export const findMatchingPreviousLine = (
    consolidatedLine: LineaPedido,
    previousOrderLines: LineaPedido[]
) => {
    return previousOrderLines.find(prevLine => 
        prevLine.nombreProducto === consolidatedLine.nombreProducto
    );
};

export const consolidateOrderLines = (orderLines: LineaPedido[]) => {
    const consolidatedMap = new Map<string, LineaPedido>();
    const nonConsolidatedLines: LineaPedido[] = [];
    
    orderLines.forEach(line => {
        // Solo consolidar Pendiente y Completada
        const shouldConsolidate = line.estado === 'Pendiente' || line.estado === 'Terminada';
        
        if (!shouldConsolidate) {
            // En_Preparacion y otros estados: no consolidar
            nonConsolidatedLines.push({ ...line });
            return;
        }
        
        // Para Pendiente y Completada, consolidar normalmente
        const key = `${line.nombreProducto}_${line.estado}`;
        
        if (consolidatedMap.has(key)) {
            const existingLine = consolidatedMap.get(key)!;
            existingLine.cantidad += line.cantidad;
        } else {
            consolidatedMap.set(key, { ...line });
        }
    });
    
    return [...Array.from(consolidatedMap.values()), ...nonConsolidatedLines];
};

export const rebuildOrderWithConsolidatedLines = (
    previousOrder: PedidoBackend,
    consolidatedOrderLines: LineaPedido[],
    price: number
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
                subtotal: price * consolidatedLine.cantidad,
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