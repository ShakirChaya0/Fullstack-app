import { Information } from "../../domain/entities/Information.js";
import { Order } from "../../domain/entities/Order.js";
import { Policy } from "../../domain/entities/Policy.js";
import { Check, CheckLine, PedidoCheck } from "../../domain/value-objects/Check.js";

export class CheckService {
    public generate(order: Order, information: Information, policy: Policy) {
        const totalCubiertos = policy.montoCubiertosPorPersona * order.cantCubiertos;
        
        const lines = order.orderLines.map((ol) => {
            const importe = ol.cantidad * ol.productoVO.monto;
            const checkLine: CheckLine = {
                nombreProducto: ol.productoVO.nombreProducto,
                cantidad: ol.cantidad,
                montoUnitario: ol.productoVO.monto,
                importe
            }
            return checkLine;
        })
        
        let subtotal = 0;
        lines.forEach(l => {
            subtotal += l.importe;
        });

        const importeImpuestos = subtotal * (policy.porcentajeIVA / 100);
        const total = subtotal + importeImpuestos;

        const pedido: PedidoCheck = {
            idPedido: order.idPedido,
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
            order.table!.nroMesa,
            new Date(),
            order.waiter!.nombre,
            totalCubiertos,
            pedido,
        );
    }
}