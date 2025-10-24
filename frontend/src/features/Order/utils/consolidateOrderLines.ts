import type { OrderLineClientInfo } from "../interfaces/Order";

export const consolidateOrderLines = (orderLines: OrderLineClientInfo[]) => {
    const consolidatedMap = new Map<string, OrderLineClientInfo>();
    const nonConsolidatedLines: OrderLineClientInfo[] = [];
    
    orderLines.forEach(line => {
        // Si está en preparación, no consolidar - agregar directamente
        if (line.estado === 'En_Preparacion') {
            nonConsolidatedLines.push({ ...line });
            return;
        }
        
        // Para otros estados, consolidar normalmente
        const key = `${line.nombreProducto}_${line.estado}`;
        
        if (consolidatedMap.has(key)) {
            // Si ya existe, sumar la cantidad
            const existingLine = consolidatedMap.get(key)!;
            existingLine.cantidad += line.cantidad;
        } else {
            // Si no existe, crear nueva entrada (copia para no mutar el original)
            consolidatedMap.set(key, { ...line });
        }
    });
    
    // Combinar líneas consolidadas con las no consolidadas
    return [...Array.from(consolidatedMap.values()), ...nonConsolidatedLines];
};