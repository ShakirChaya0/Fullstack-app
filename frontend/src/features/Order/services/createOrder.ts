import type { Pedido, OrderWithTableId } from "../interfaces/Order";

export async function createOrder (
apiCall: (url: string, options?: RequestInit) => Promise<Response>,    
orderData: Pedido | OrderWithTableId) {   

    const tableNumber = "tableNumber" in orderData ? { tableNumber: orderData.tableNumber } : null 
    const bodyReq = {
        ...tableNumber,
        order: {
            cantidadCubiertos: orderData.comensales,
            observacion: orderData.observaciones,
            items: orderData.lineasPedido.map((lp) => {
                if("_type" in lp.producto) {
                    return {
                        nombre: lp.producto._name,
                        tipo: lp.producto._type,
                        monto: lp.producto._price,
                        cantidad: lp.cantidad
                    }    
                }
                return {
                    nombre: lp.producto._name,
                    monto: lp.producto._price,
                    cantidad: lp.cantidad,
                    esAlcoholica: lp.producto._isAlcoholic
                }
            })
        }
    }

    const response = await apiCall('pedidos', {
        method: 'POST',
        body: JSON.stringify(bodyReq)
    })


    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }   

    const data = await response.json()
    
    return data
}