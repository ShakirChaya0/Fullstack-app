import { Information } from "../../domain/entities/Information.js";
import { Order } from "../../domain/entities/Order.js";
import { Policy } from "../../domain/entities/Policy.js";
import { Check, CheckLine, PedidoCheck } from "../../domain/value-objects/Check.js";

export class CheckService {
    public generate(order: Order, information: Information, policy: Policy) {
        const totalCubiertos = order.calculateCutleryTotal(policy.montoCubiertosPorPersona);
        
        const lines = order.orderLines.map((ol) => {
            const importe = ol.calculateSubtotal();
            const checkLine: CheckLine = {
                nombreProducto: ol.productoVO.productName,
                cantidad: ol.amount,
                montoUnitario: ol.productoVO.amount,
                importe
            }
            return checkLine;
        })
        
        const { subtotal, importeImpuestos, total } = order.calculateTotal(policy.porcentajeIVA);

        const pedido: PedidoCheck = {
            idPedido: order.orderId,
            lines,
            subtotal,
            importeImpuestos,
            total
        }

        return new Check(
            information.nombreRestaurante,
            information.direccionRestaurante,
            information.razonSocial,
            information.telefonoContacto,
            order.table!.tableNum,
            new Date(),
            order.waiter!.nombre,
            totalCubiertos,
            pedido,
        );
    }
}