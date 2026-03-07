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

        const policy = await this.policyRepository.getPolicy();
        const iva = policy.porcentajeIVA;
        const cutleryAmount = policy.montoCubiertosPorPersona;

        const totalWithCutlery = order.calculateTotal(iva).total + order.calculateCutleryTotal(cutleryAmount);

        const draft = {
            items: [
                {
                    id: `${order.orderId}`,
                    title: `Pagar Pedido: ${order.orderId}`,
                    quantity: 1,
                    unit_price: totalWithCutlery
                }
            ],
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: []
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/Cliente/Pedido/Pago/Exito`, 
                failure: `${process.env.FRONTEND_URL}/Cliente/Pedido/Pago/Fallo/${order.orderId}`, 
                pending: `${process.env.FRONTEND_URL}/Cliente/Pedido/Pago/Pendiente` 
            },
            auto_return: "approved",
            external_reference: JSON.stringify({orderId: order.orderId, metodoPago: "MercadoPago"}),
            notification_url: `${process.env.BACKEND_URL}/pagos/pagado`, 
        }

        console.log('🔔🔔🔔🔔🔔🔔🔔🔔 Notification URL:', draft.notification_url);
        console.log('🔙🔙🔙🔙🔙🔙🔙 Back URLs:', draft.back_urls);

        const preference = await this.mpService.createPreference(draft)
        
        return preference
    }
}