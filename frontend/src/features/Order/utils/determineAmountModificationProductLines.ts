import type { LineaPedido, OrderLineClientInfo } from "../interfaces/Order";

type ProductsWithAmount = {
    producto: LineaPedido,
    diferencia: number
}

export function determineAmountModificationProductLines (newLP: OrderLineClientInfo[], oldLP: LineaPedido[]): ProductsWithAmount[] {
    // Evaluamos lineas modificadas
    const productWithAmount: ProductsWithAmount[] = []
    newLP.forEach(lp => {
        // Solo considerar líneas que siguen existiendo en ambos pedidos
        const original = oldLP.find(oldLp => 
            oldLp.producto._name === lp.nombreProducto 
        );

        if (original && original.cantidad !== lp.cantidad && original.estado === 'Pendiente' && lp.estado === 'Pendiente') {
            const diferencia = lp.cantidad - original.cantidad //A la cantidad de la linea con modificación se le resta la linea desactualizada
            productWithAmount.push({
                producto: original, 
                diferencia: diferencia
            })
        }
    });

    return productWithAmount
}