import type { OrderLineClientInfo } from "../interfaces/Order";

export const consolidateOrderLines = (orderLines: OrderLineClientInfo[]) => {
    const consolidatedMap = new Map<string, OrderLineClientInfo>();
    const nonConsolidatedLines: OrderLineClientInfo[] = [];
    
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