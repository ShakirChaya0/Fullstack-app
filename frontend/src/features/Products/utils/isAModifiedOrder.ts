import type { LineaPedido, Pedido } from "../../Order/interfaces/Order";

export function isAModifiedOrder(
    order: Pedido, 
    comensales: number, 
    observaciones: string
): boolean {
    const compareLinesPedido = (lines1: LineaPedido[], lines2: LineaPedido[]): boolean => {
        if (lines1.length !== lines2.length) return false;
        
        return lines1.every((line1, index) => {
            const line2 = lines2[index];
            return (
                line1.producto._name === line2.producto._name &&
                line1.cantidad === line2.cantidad &&
                line1.subtotal === line2.subtotal
            )
        })
    }

    try {
        const previousOrderStr = localStorage.getItem("previousOrder")
        if (!previousOrderStr) return true // No hay orden previa = es modificada
        
        const previous = JSON.parse(previousOrderStr)
        
        if (!previous) return true
        
        // Comparar todos los campos
        const isSameComensales = previous.comensales === comensales
        const isSameObservaciones = previous.observaciones === observaciones
        const isSameLines = compareLinesPedido(previous.lineasPedido || [], order.lineasPedido)
        
        // Si todo es igual, NO está modificada (return false)
        // Si algo cambió, SÍ está modificada (return true)
        return !(isSameComensales && isSameObservaciones && isSameLines)
        
    } catch {
        return true // En caso de error, asumir que está modificada
    }
}