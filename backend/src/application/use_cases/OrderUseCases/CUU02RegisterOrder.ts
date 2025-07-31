import { Order } from "../../../domain/entities/Order.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { OrderLineSchema, OrderSchema } from "../../../shared/validators/orderZod.js";


function isAlcoholicDrink(orderLines: OrderLineSchema[]): boolean {
    orderLines.forEach(order => {
        if(order.esAlcoholica) {
            return true
        }
    })
    return false
}
    

function getAge(birthday: Date): number {
  const today = new Date();
  return today.getFullYear() - birthday.getFullYear() - 
    (today < new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate()) ? 1 : 0);
}


export class CUU02RegisterOrder {
    constructor(
        private orderRepository = new OrderRepository(),
        private clientRepository = new ClientRepository()
    ){}

    public async execute(order: OrderSchema, clientId: string, waiterId: string, tableNumber: number): Promise<Order | null>{
        const client = await this.clientRepository.getClientByidUser(clientId);
        if(!client) {
            throw new NotFoundError('Cliente no encontrado');
        }

        const age = getAge(client.birthDate)
        if(age < 18 && isAlcoholicDrink(order.items)){
            throw new BusinessError('El cliente debe ser mayor de 18 años para pedir una bebida alcohólica')
        }

        const createdOrder = await this.orderRepository.create(order, waiterId, tableNumber)

        return createdOrder
    }
}