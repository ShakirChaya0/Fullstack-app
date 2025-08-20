import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { PolicyRepository } from "../../../infrastructure/database/repository/PolicyRepository.js";
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

        const policy = await this.policyRepository.getPolicy()
        const iva = policy.porcentajeIVA;

        const draft = {
            items: [
                {
                    id: `${order.orderId}`,
                    title: `Pagar Pedido: ${order.orderId}`,
                    quantity: 1,
                    unit_price: order.calculateTotal(iva).total + order.calculateCutleryTotal(policy.montoCubiertosPorPersona)
                }
            ],
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: []
            },
            back_urls: {
                success: "payment/success", //cambiar cuando se haga el front
                failure: "payment/failure", //cambiar cuando se haga el front
                pending: "payment/pending" //cambiar cuando se haga el front
            },
            auto_return: "approved",
            external_reference: JSON.stringify({orderId: order.orderId, metodoPago: "MercadoPago"}),
            notification_url: "/pagos/pagado", //cambiar cuando se haga el deploy por el endpoint que corresponda
        }

        const preference = await this.mpService.createPreference(draft)
        
        return preference
    }
}