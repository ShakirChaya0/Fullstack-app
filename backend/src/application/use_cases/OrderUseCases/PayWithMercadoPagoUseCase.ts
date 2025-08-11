import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { PolicyRepository } from "../../../infrastructure/database/repository/Fix_policyRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { MercadoPagoService } from "../../services/MercadoPagoService.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";

export class PayWithMercadoPagoUseCase {
    constructor(
        private mpService = new MercadoPagoService(),
        private orderRepository = new OrderRepository(),
        private policyRepository = new PolicyRepository(),
    ){}
    
    async execute(orderId: number): Promise<PreferenceResponse> {
        const order = await this.orderRepository.getOne(orderId)
        if(!order) throw new NotFoundError("Pedido no encontrado")
        
        if(order.status !== 'Pendiente_De_Pago') {
            throw new BusinessError('El pedido debe estar pendiente de pago para poder abonarse con Mercado Pago');
        }

        const iva = (await this.policyRepository.getPolicy()).porcentajeIVA;

        const draft = {
            items: [
                {
                    id: `${order.orderId}`,
                    title: `Pagar Pedido: ${order.orderId}`,
                    quantity: 1,
                    unit_price: order.calculateTotal(iva).total
                }
            ],
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: []
            },
            back_urls: {
                success: "/success",
                failure: "/failure",
                pending: "/pending"
            },
            auto_return: "approved",
            external_reference: JSON.stringify({orderId: order.orderId, metodoPago: "MercadoPago"}),
            notification_url: "/pagos/pagado",
        }

        const preference = await this.mpService.createPreference(draft)
        
        return preference
    }
}