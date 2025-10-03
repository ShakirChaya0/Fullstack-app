import type { Pedido, OrderWithTableId } from "../interfaces/Order";

export async function createOrder (
apiCall: (url: string, options?: RequestInit) => Promise<Response>,    
orderData: Pedido | OrderWithTableId) {    
    const bodyReq = {
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

    await apiCall('qr/2')

    const response = await apiCall('pedidos', {
        method: 'POST',
        body: JSON.stringify(bodyReq)
    })

    console.log(response.status)

    if (!response.ok) {
        if (response.status === 404) {
            try {
                const errorData = await response.json()
                const error = new Error(errorData.message || 'Error al registrar el pedido')
                error.name = 'NotFoundError'
                throw error
            } catch {
                const error = new Error('Error al registrar el pedido')
                error.name = 'NotFoundError'
                throw error
            }
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
    }   

    const data = await response.json()
    
    return data
}