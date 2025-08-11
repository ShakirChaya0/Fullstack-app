import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { OrderLineSchema} from "../../../shared/validators/orderZod.js";


export class AddOrderLineUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository(),
        private readonly productRepository = new ProductRepository()
    ){}

    public async execute(orderId: number, orderLines: OrderLineSchema[]): Promise<Order>{
        const order = await this.orderRepository.getOne(orderId)
        
        if (!order) {
            throw new NotFoundError("Pedido no encontrado");
        }

        if (order.status == "Completado") {
            await this.orderRepository.changeState(order, "En_Preparacion")
        }

                
        let aux = false
        orderLines.forEach(async (item) => {
            const existItem = await this.productRepository.getByUniqueName(item.nombre)
            if(!existItem) aux = true
        })
        if(!aux){
            throw new NotFoundError(`No se encontro uno de los productos`);
        }
    

        const newOrder = await this.orderRepository.addOrderLines(orderId, orderLines)

        return newOrder
    }
}