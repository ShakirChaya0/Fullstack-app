import type { OrderLineClientInfo } from "../interfaces/Order";

export const getLineasDuplicadasParaEliminar = (originalLines: OrderLineClientInfo[], consolidatedLines: OrderLineClientInfo[]) => {
    const lineasParaEliminar: number[] = [];
    
    // Solo procesar líneas que NO están en preparación (las que sí se consolidaron)
    const lineasConsolidadasReales = consolidatedLines.filter(line => line.estado !== 'En_Preparacion');
    
    lineasConsolidadasReales.forEach(consolidated => {
        // Encontrar todas las líneas originales que contribuyeron a esta consolidada
        const lineasOriginalesDelMismoProductoYEstado = originalLines.filter(original => 
            original.nombreProducto === consolidated.nombreProducto && 
            original.estado === consolidated.estado
        );
        
        // Si hay más de una línea original para el mismo producto+estado,
        // eliminar todas excepto la primera (que se mantiene con cantidad consolidada)
        if (lineasOriginalesDelMismoProductoYEstado.length > 1) {
            // Eliminar todas excepto la primera
            lineasOriginalesDelMismoProductoYEstado.slice(1).forEach(lineaAEliminar => {
                lineasParaEliminar.push(lineaAEliminar.nroLinea);
            });
        }
    });
    
    return lineasParaEliminar;
};