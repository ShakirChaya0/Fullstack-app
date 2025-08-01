import { Prisma, PrismaClient } from "@prisma/client";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository.js";
import { Payment, PaymentMethod } from "../../../domain/entities/Payment.js";
import { OrderLine } from "../../../domain/entities/OrderLine.js";
import { ProductoVO } from "../../../domain/value-objects/ProductVO.js";
import { Order, OrderStatus } from "../../../domain/entities/Order.js";
import { FoodType } from "../../../domain/entities/Product.js";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { Table } from "../../../domain/entities/Table.js";
import { UUID } from "crypto";

const prisma = new PrismaClient();

type PaymentWithOrder = Prisma.PagosGetPayload<{
    include: { 
        Pedido: {
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: {
                    include: { Usuarios: true }
                },
            }
        }
    }
}>;

export class PaymentRepository implements IPaymentRepository {

    public async getAll(): Promise<Payment[]> {
        const payments = await prisma.pagos.findMany({
            include: {
                Pedido: {
                    include: {
                        Mesa: true,
                        Linea_De_Pedido: true,
                        Mozos: {
                            include: { Usuarios: true }
                        },
                    }
                }
            }
        });
        return payments.map(p => { return this.toDomainEntity(p) });
    }

    public async getByOrder(order: Order): Promise<Payment | null> {
        const payment = await prisma.pagos.findFirst({
            where: { idPedido: order.orderId },
            include: {
                Pedido: {
                    include: {
                        Mesa: true,
                        Linea_De_Pedido: true,
                        Mozos: {
                            include: { Usuarios: true }
                        },
                    }
                }
            }
        });

        if (!payment) return null;

        return this.toDomainEntity(payment);
    }

    public async getByDateRange(dateFrom: Date, dateTo: Date): Promise<Payment[]> {
        const payments = await prisma.pagos.findMany({
            where: {
                fechaPago: { 
                    lte: dateFrom,
                    gte: dateTo
                }
            },
            include: {
                Pedido: {
                    include: {
                        Mesa: true,
                        Linea_De_Pedido: true,
                        Mozos: {
                            include: { Usuarios: true }
                        },
                    }
                }
            }
        });
        return payments.map(p => { return this.toDomainEntity(p) });
    }

    public async getByPaymentMethod(paymentMethod: PaymentMethod): Promise<Payment[]> {
        const payments = await prisma.pagos.findMany({
            where: { metodoPago: paymentMethod },
            include: {
                Pedido: {
                    include: {
                        Mesa: true,
                        Linea_De_Pedido: true,
                        Mozos: {
                            include: { Usuarios: true }
                        },
                    }
                }
            }
        });
        return payments.map(p => { return this.toDomainEntity(p) });
    }

    public async create(order: Order, paymentMethod: PaymentMethod, transactionId: string | null): Promise<void> {
        await prisma.pagos.create({
            data: {
                idPedido: order.orderId,
                metodoPago: paymentMethod,
                fechaPago: new Date(),
                idTransaccionMP: transactionId
            }
        });
    }

    private toDomainEntity(payment: PaymentWithOrder): Payment {
        const table = payment.Pedido.Mesa ? new Table(payment.Pedido.Mesa.nroMesa, payment.Pedido.Mesa.capacidad, payment.Pedido.Mesa.estado) : undefined;
        const waiter = payment.Pedido.Mozos ? new Waiter(
                    payment.Pedido.Mozos.Usuarios.idUsuario as UUID,
                    payment.Pedido.Mozos.Usuarios.nombreUsuario,
                    payment.Pedido.Mozos.Usuarios.email,
                    payment.Pedido.Mozos.Usuarios.contrasenia,
                    payment.Pedido.Mozos.Usuarios.tipoUsuario,
                    payment.Pedido.Mozos.nombre,
                    payment.Pedido.Mozos.apellido,
                    payment.Pedido.Mozos.dni,
                    payment.Pedido.Mozos.telefono
                )
                : undefined;
        
        const publicWaiter = waiter?.toPublicInfo();

        const orderLines = payment.Pedido.Linea_De_Pedido.map((ol) => {
            const tipoComida = ol.tipoComida === "EMPTY_ENUM_VALUE" ? null : ol.tipoComida as FoodType;
            const productoVO = new ProductoVO(ol.nombreProducto, Number(ol.monto), tipoComida)
            return new OrderLine(
                ol.nroLinea,
                ol.estado,
                ol.cantidad,
                productoVO,
            )
        });
        
        const order = new Order(
            payment.Pedido.idPedido,
            payment.Pedido.horaInicio.toISOString(),
            payment.Pedido.estado as OrderStatus,
            payment.Pedido.cantCubiertos,
            payment.Pedido.observaciones,
            orderLines,
            table,
            publicWaiter
        );

        return new Payment(
            payment.idPago, 
            order, 
            payment.metodoPago as PaymentMethod, 
            payment.fechaPago, 
            payment.idTransaccionMP ? payment.idTransaccionMP : undefined
        );
    }
}