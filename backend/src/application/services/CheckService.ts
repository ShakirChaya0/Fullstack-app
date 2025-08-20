import { Information } from "../../domain/entities/Information.js";
import { Order } from "../../domain/entities/Order.js";
import { Policy } from "../../domain/entities/Policy.js";
import { Check } from "../../domain/value-objects/Check.js";
import { CheckLine, PedidoCheck } from "../../shared/types/SharedTypes.js";

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
            total: total + totalCubiertos
        }

        const fecha = new Date(Date.UTC(
            (new Date()).getFullYear(),
            (new Date()).getMonth(),
            (new Date()).getDate(),
            (new Date()).getHours(),
            (new Date()).getMinutes(),
            0, 0
        ))

        return new Check(
            information.nombreRestaurante,
            information.direccionRestaurante,
            information.razonSocial,
            information.telefonoContacto,
            order.table!.tableNum,
            fecha,
            order.waiter!.nombre,
            totalCubiertos,
            pedido,
        );
    }
}