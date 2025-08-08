import { Prisma, PrismaClient } from "@prisma/client";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository.js";
import { Order, OrderStatus } from "../../../domain/entities/Order.js";
import { Table } from "../../../domain/entities/Table.js";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { UUID } from "crypto";
import { OrderLine } from "../../../domain/entities/OrderLine.js";
import { ProductoVO } from "../../../domain/value-objects/ProductVO.js";
import { FoodType } from "../../../domain/entities/Product.js";
import { OrderSchema } from "../../../shared/validators/orderZod.js";

const prisma = new PrismaClient();

type OrderWithAll = Prisma.PedidoGetPayload<{
    include: { Mesa: true, Linea_De_Pedido: true, Mozos: { include: { Usuarios: true }} }
}>;

export class OrderRepository implements IOrderRepository {

    public async create(order: OrderSchema, waiterId: string, tableNumber: number): Promise<Order | null>{
 
        const createdOrder = await prisma.pedido.create({
        data: {
            horaInicio:  new Date(),
            estado: 'Solicitado',
            cantCubiertos: order.cantidadCubiertos,
            observaciones: order.observacion,
            nroMesa: tableNumber,
            idMozo: waiterId,
            Linea_De_Pedido: {
            create: order.items.map(linea => ({
                nombreProducto: linea.nombre,
                monto: linea.monto,
                estado: 'Pendiente',
                cantidad: linea.cantidad,
                tipoComida: linea.tipo || null
            }))
            }
        },
        include: {
            Mesa: true,
            Linea_De_Pedido: true,
            Mozos: { 
                include: { Usuarios: true } 
            }
        }
        });
    return this.toDomainEntity(createdOrder)
    }
    
    
    public async getOne(id: number): Promise<Order | null> {
        const order = await prisma.pedido.findUnique({
            where: { idPedido: id },
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: { 
                    include: { Usuarios: true } 
                }
            }
        });

        if (!order) return null;

        return this.toDomainEntity(order);
    }

    public async changeState(order: Order, state: OrderStatus): Promise<void> {
        await prisma.pedido.update({
            where: { idPedido: order.orderId },
            data: { estado: state }
        });
    }

    private toDomainEntity(order: OrderWithAll): Order {
        const table = order.Mesa ? new Table(order.Mesa.nroMesa, order.Mesa.capacidad, order.Mesa.estado) : undefined;
        const waiter = order.Mozos ? new Waiter(
                    order.Mozos.Usuarios.idUsuario as UUID,
                    order.Mozos.Usuarios.nombreUsuario,
                    order.Mozos.Usuarios.email,
                    order.Mozos.Usuarios.contrasenia,
                    order.Mozos.Usuarios.tipoUsuario,
                    order.Mozos.nombre,
                    order.Mozos.apellido,
                    order.Mozos.dni,
                    order.Mozos.telefono
                )
                : undefined;
        
        const publicWaiter = waiter?.toPublicInfo();

        const orderLines = order.Linea_De_Pedido.map((ol) => {
            const tipoComida = ol.tipoComida === "EMPTY_ENUM_VALUE" ? null : ol.tipoComida as FoodType;
            const productoVO = new ProductoVO(ol.nombreProducto, Number(ol.monto), tipoComida)
            return new OrderLine(
                ol.nroLinea,
                ol.estado,
                ol.cantidad,
                productoVO,
            )
        });

        return new Order(
            order.idPedido,
            order.horaInicio.toISOString().slice(11,16),
            order.estado as OrderStatus,
            order.cantCubiertos,
            order.observaciones,
            orderLines,
            table,
            publicWaiter
        );
    }
}