import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { ValidationError } from "../../../shared/exceptions/ValidationError.js";
import { PartialOrderMinimal } from "../../../shared/validators/OrderZod.js";


export class UpdateOrderUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository()
    ){}

    public async execute(orderId: number, lineNumbers: number[] | undefined, data: Partial<PartialOrderMinimal>): Promise<Order>{

        const order = await this.orderRepository.getOne(orderId)
        
        if (!order) {
            throw new NotFoundError("Pedido no encontrado");
        }

        const isInProcess =  order.orderLines.some(line => {
            line.status == "En_Preparacion"
        })

        if(isInProcess && data.items) {
            throw new BusinessError(`No se puede modificar el pedido, debido a que se intento modificar líneas de pedido que ya estan en preparación`)
        }
 
        if (order.status != "Solicitado" && data.observacion) {
            throw new BusinessError(`No se puede modificar la observación. El pedido ya se encuentra en preparación`)
        }

        if (order.status != "En_Preparacion" && order.status != "Solicitado" && order.status != "Completado" && data.cantidadCubiertos) {
            throw new BusinessError(`No se puede modificar la cantidad de comensales. El pedido se encuentra pagado o por pagar`)
        }

        if (data.items && lineNumbers) {
            if (lineNumbers.length !== data.items.length) throw new ValidationError("La cantidad de números de líneas y de items debe ser la misma");
        }

        if (lineNumbers) {
            lineNumbers.forEach(number => {
                const exists = order.orderLines.find(ol => ol.lineNumber == number);
                if (!exists) throw new NotFoundError("La linea de pedido que quiere modificar no existe");
            })
        }

        const updatedOrder = await this.orderRepository.modifyOrder(orderId, lineNumbers, data)

        return updatedOrder
    }
}