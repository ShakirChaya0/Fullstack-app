import { Order } from "../../../domain/entities/Order.js";
import { QRTokenInterface } from "../../../domain/interfaces/QRToken.interface.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { QRTokenRepository } from "../../../infrastructure/database/repository/QRTokenRepository.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { UserType } from "../../../shared/types/SharedTypes.js";
import { OrderLineSchema, OrderSchema } from "../../../shared/validators/OrderZod.js";

export class CUU02RegisterOrder {
    constructor(
        private readonly orderRepository = new OrderRepository(),
        private readonly clientRepository = new ClientRepository(),
        private readonly qrTokenRepository = new QRTokenRepository(),
        private readonly tableRepository = new TableRepository(),
        private readonly productRepository = new ProductRepository()
    ){}

    public async execute(order: OrderSchema, userId: string | undefined, userType: UserType | undefined, qrtoken: string | undefined, tableNumberIsWaiter: number | undefined): Promise<Order>{

        if (userId != undefined && userType == 'Cliente') {
            //Validando edad del Cliente
            const client = await this.clientRepository.getClientByidUser(userId);
            const age = this.getAge(client!.birthDate)
            if (age < 18 && this.isAlcoholicDrink(order.items)) {
                throw new BusinessError('El cliente debe ser mayor de 18 años para pedir una bebida alcohólica')
            }
        }

        let qrTokenData: QRTokenInterface | null
        if(qrtoken){
            qrTokenData = await this.qrTokenRepository.getQRDataByToken(qrtoken);
            if (!qrTokenData) {
                throw new NotFoundError('No se encontro registro para ese token');
            }
            if (qrTokenData.revocado) throw new BusinessError('El QR ya fue usado')
        }      

        if(tableNumberIsWaiter){
            const table = await this.tableRepository.getByNumTable(tableNumberIsWaiter)

            if (!table) {
                throw new NotFoundError(`No se encontro un la mesa con el numero de mesa: ${tableNumberIsWaiter}`);
            }
        }
        
        let aux = false;

        for (const item of order.items) {
            const existItem = await this.productRepository.getByUniqueName(item.nombre)
            if (!existItem) {
                aux = true;
                break; 
            }
        }

        if (aux) {
            throw new NotFoundError(`No se encontró uno de los productos`);
        }
        
        const createdOrder = await this.orderRepository.create(order, !qrtoken ? userId! : qrTokenData!.idMozo, !qrtoken ? tableNumberIsWaiter! : qrTokenData!.nroMesa)

        await this.qrTokenRepository.revoke(createdOrder.table!.tableNum); 

        return createdOrder
    }

    private isAlcoholicDrink(orderLines: OrderLineSchema[]): boolean {
        return orderLines.some(order => order.esAlcoholica === true);
    }

    private getAge(birthday: Date): number {
        const today = new Date();
        return today.getFullYear() - birthday.getFullYear() - (today < new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate()) ? 1 : 0);
    }
}