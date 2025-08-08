import { Order } from "../../../domain/entities/Order.js";
import { Check } from "../../../domain/value-objects/Check.js";
import { InformationRepository } from "../../../infrastructure/database/repository/InformationRepository.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { PolicyRepository } from "../../../infrastructure/database/repository/PolicyRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { ServerError } from "../../../shared/exceptions/ServerError.js";
import { CheckService } from "../../services/CheckService.js";

export class GenerateCheckUseCase {
    constructor(
        private orderRepository = new OrderRepository(),
        private informationRepository = new InformationRepository(),
        private policyRepository = new PolicyRepository(),
        private checkService = new CheckService()
    ){}
    
    async execute(orderId: number): Promise<{ order: Order, check: Check}> {
        const orderFound = await this.orderRepository.getOne(orderId);

        if (!orderFound) throw new NotFoundError("Pedido no encontrado");
        if (orderFound.status === "Pendiente_De_Pago" || orderFound.status === "Completado") {
            if (!orderFound.waiter || !orderFound.table) throw new ServerError("El Mozo o la Mesa del pedido no existe");

            const information = await this.informationRepository.getInformation();
            const policy = await this.policyRepository.getPolicy();
            
            const check = this.checkService.generate(orderFound, information, policy);
            const order = await this.orderRepository.changeState(orderFound, "Pendiente_De_Pago");
            
            return { order, check };
        }
        throw new BusinessError("El pedido debe estar completado para ser pagado");
    }
}