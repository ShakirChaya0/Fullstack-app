import { Order } from "../../../domain/entities/Order.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { OrderLineSchema, OrderSchema } from "../../../shared/validators/orderZod.js";


function isAlcoholicDrink(orderLines: OrderLineSchema[]): boolean {
    return orderLines.some(order => order.esAlcoholica === true);
}
    

function getAge(birthday: Date): number {
  const today = new Date();
  return today.getFullYear() - birthday.getFullYear() - 
    (today < new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate()) ? 1 : 0);
}


export class CUU02RegisterOrder {
    constructor(
        private orderRepository = new OrderRepository(),
        private clientRepository = new ClientRepository(),
        private tableRepository = new TableRepository()
    ){}

    public async execute(order: OrderSchema, userId: string | undefined, waiterId: string | undefined, tableNumber: number): Promise<Order | null>{
        if (userId != undefined && waiterId != undefined) {
            const client = await this.clientRepository.getClientByidUser(userId);
            const age = getAge(client!.birthDate)
            if(age < 18 && isAlcoholicDrink(order.items)){
                throw new BusinessError('El cliente debe ser mayor de 18 años para pedir una bebida alcohólica')
            }
        }

        const table = await this.tableRepository.getByNumTable(tableNumber);
        if(!table) {
            throw new NotFoundError('Mesa no encontrada');
        }

        //Ver si en un futuro se agrega la validación de que el producto existe (se evito por cuestiones de prueba)

        if(waiterId != undefined){
            const createdOrder = await this.orderRepository.create(order, waiterId, tableNumber)
            return createdOrder
        } else {
            const createdOrder = await this.orderRepository.create(order, userId, tableNumber)
            return createdOrder
        }
    }

}