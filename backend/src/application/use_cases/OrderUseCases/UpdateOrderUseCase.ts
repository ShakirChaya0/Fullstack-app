import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { PartialOrderSchema } from "../../../shared/validators/orderZod.js";


export class UpdateOrderUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository(),
        private readonly productRepository = new ProductRepository()
    ){}

    public async execute(orderId: number, lineNumbers: number[], data: PartialOrderSchema): Promise<Order>{
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
        

        if (order.status != "En_Preparacion" && order.status != "Solicitado" && order.status == "Completado" && data.cantidadCubiertos) {
            throw new BusinessError(`No se puede modificar la cantidad de comensales. El pedido se encuentra pagado o por pagar`)
        }

        if(data.items){ 
            let aux = false
            data.items.forEach(async (item) => {
                const existItem = await this.productRepository.getByUniqueName(item.nombre)
                if(!existItem) aux = true
            })
            if(!aux){
                throw new NotFoundError(`No se encontro uno de los productos`);
            }
        }
                

        const newOrder = await this.orderRepository.modifyOrder(orderId, lineNumbers, data)

        return newOrder
    }

}