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
    
    async execute(orderId: number): Promise<Check> {
        const order = await this.orderRepository.getOne(orderId);

        if (!order) throw new NotFoundError("Pedido no encontrado");
        if (order.estado === "Pendiente_De_Pago" || order.estado === "Completado") {
            if (!order.waiter || !order.table) throw new ServerError("El Mozo o la Mesa del pedido no existe");

            const information = await this.informationRepository.getInformation();
            const policy = await this.policyRepository.getPolicy();
            
            const check = this.checkService.generate(order, information, policy);
            await this.orderRepository.changeState(order, "Pendiente_De_Pago");
            
            return check;
        }
        throw new BusinessError("El pedido debe estar completado para ser pagado");
    }
}