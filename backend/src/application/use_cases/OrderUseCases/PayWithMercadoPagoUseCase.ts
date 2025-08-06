import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { PolicyRepository } from "../../../infrastructure/database/repository/PolicyRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { MercadoPagoService } from "../../services/MercadoPagoService.js";

export class PayWithMercadoPagoUseCase {
    constructor(
        private mpService = new MercadoPagoService(),
        private orderRepository = new OrderRepository(),
        private policyRepository = new PolicyRepository(),
    ){}
    
    async execute(orderId: number): Promise<PreferenceResponse> {
        const order = await this.orderRepository.getOne(orderId)
        if(!order) throw new NotFoundError("Pedido no encontrado")
        const iva = (await this.policyRepository.getPolicy()).porcentajeIVA

        const draft = {
            items: [
                {
                    id: `${order.orderId}`,
                    title: `Pagar Pedido: ${order.orderId}`,
                    quantity: 1,
                    unit_price: (order.calculateTotal(iva).total)/2
                }
            ],
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: []
            },
            back_urls: {
                success: "https://www.youtube.com",
                failure: "https://www.youtube.com",
                pending: "https://www.youtube.com"
            },
            auto_return: "approved",
            external_reference: JSON.stringify({orderId: order.orderId, metodoPago: "MercadoPago"}),
            notification_url: "https://localhost:3000/pagos/pagado",
        }

        const preference = await this.mpService.createPreference(draft)
        
        return preference
    }
}