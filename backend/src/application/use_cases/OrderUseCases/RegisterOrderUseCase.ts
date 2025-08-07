import { Order } from "../../../domain/entities/Order.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { QRTokenRepository } from "../../../infrastructure/database/repository/QRTokenRepository.js";
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
        private qrTokenRepository = new QRTokenRepository()
    ){}
    // Cambiar tipado de userType al enum
    public async execute(order: OrderSchema, userId: string | undefined, userType: string | undefined, qrtoken: string | undefined, tableNumberIsWaiter: string | undefined): Promise<Order | null>{
        if (userId != undefined && userType == '') {
            const client = await this.clientRepository.getClientByidUser(userId);
            const age = getAge(client!.birthDate)
            if(age < 18 && isAlcoholicDrink(order.items)){
                throw new BusinessError('El cliente debe ser mayor de 18 años para pedir una bebida alcohólica')
            }
        }

        if(qrtoken){
            const qrTokenData = await this.qrTokenRepository.getQRDataByToken(qrtoken);
            if(!qrTokenData) {
                throw new NotFoundError('No se encontro registro para ese token');
            }

        }
            
        //Ver si en un futuro se agrega la validación de que el producto existe (se evito por cuestiones de prueba)
        
        const createdOrder = await this.orderRepository.create(order, userId, tableNumberIsWaiter ? tableNumberIsWaiter : qrTokenData.nroMesa)

        console.log(createdOrder)
        return createdOrder
    }

}