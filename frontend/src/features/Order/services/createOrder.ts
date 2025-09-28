import type { Pedido, OrderWithTableId } from "../interfaces/Order";

export async function createOrder (orderData: Pedido | OrderWithTableId, token: string) {    
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
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pedidos`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyReq),
        credentials: "include"
    })

    if(!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message
        switch(response.status){
            case 409:
                return errorMessage
            case 503:
                return errorMessage
            default:
                return errorMessage
        }
    }

    const data = await response.json()
    
    return data
}

/*
"order": {
        "cantidadCubiertos": 4,
        "observacion": "Pan sin gluten",
        "items": [
            {
            "nombre": "Pan Sin TAC",
            "tipo": "Postre",
            "monto": 5000.00,
            "cantidad": 4
            },
            {
            "nombre": "Hamburguesa con queso",
            "tipo": "Plato_Principal",
            "monto": 12000.00,
            "cantidad": 2
            }
        ]
    }
*/