import { Prisma, PrismaClient } from "@prisma/client";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository.js";
import { Order, OrderStatus } from "../../../domain/entities/Order.js";
import { Table } from "../../../domain/entities/Table.js";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { UUID } from "crypto";
import { OrderLine, OrderLineStatus } from "../../../domain/entities/OrderLine.js";
import { ProductoVO } from "../../../domain/value-objects/ProductVO.js";
import { FoodType } from "../../../domain/entities/Product.js";
import { OrderLineSchema, OrderSchema, PartialOrderSchema } from "../../../shared/validators/orderZod.js";

const prisma = new PrismaClient();

type OrderWithAll = Prisma.PedidoGetPayload<{
    include: { Mesa: true, Linea_De_Pedido: true, Mozos: { include: { Usuarios: true }} }
}>;

export class OrderRepository implements IOrderRepository {

    public async getActiveOrders(): Promise<Order[]> {
        const orders = await prisma.pedido.findMany({
            where: {
                estado: {
                    in: ["Solicitado", "En_Preparacion"]
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

        return orders.map(or => { return this.toDomainEntity(or) })
    }

    public async getOrdersByWaiter(waiterId: string): Promise<Order[]> {
        const orders = await prisma.pedido.findMany({
            where: {
                idMozo: waiterId
            },
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: { 
                    include: { Usuarios: true } 
                }
            }
        });

        return orders.map(or => { return this.toDomainEntity(or) })
    }

    public async create(order: OrderSchema, waiterId: string, tableNumber: number): Promise<Order>{
        
        const timeAsDate = new Date(Date.UTC(1970, 0, 1, (new Date).getHours(), (new Date).getMinutes() , 0));

        const createdOrder = await prisma.pedido.create({
            data: {
                horaInicio: timeAsDate,
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

    public async changeState(order: Order, state: OrderStatus): Promise<Order> {
        const updatedOrder = await prisma.pedido.update({
            where: { idPedido: order.orderId },
            data: { estado: state },
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: {
                    include: { Usuarios: true }
                }
            }
        });

        return this.toDomainEntity(updatedOrder)
    }

    public async changeOrderLineStatus(orderId: number, lineNumber: number, status: OrderLineStatus): Promise<Order> {
        const updatedOrder = await prisma.pedido.update({
            where: { idPedido: orderId },
            data: {
                Linea_De_Pedido: {
                    update: {
                        where: {
                            idPedido_nroLinea: {
                                idPedido: orderId,
                                nroLinea: lineNumber
                            }
                        },
                        data: { estado: status}
                    }
                }
            },
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: { 
                    include: { Usuarios: true } 
                }
            }
        })
        
        return this.toDomainEntity(updatedOrder)
    }

    public async addOrderLines(orderId: number, orderLines: OrderLineSchema[]): Promise<Order> {
        const updatedOrder = await prisma.pedido.update({
            where: { idPedido: orderId },
            data: {
                Linea_De_Pedido: {
                    create: orderLines.map( linea => ({
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
        })
        return this.toDomainEntity(updatedOrder)
    }

    public async modifyOrder(orderId: number, lineNumber: number[], data: PartialOrderSchema): Promise<Order> {
        
        const itemsToProcess = data.items ?? []

        if (itemsToProcess.length === 0) {
            const updatedOrder = await prisma.pedido.update({
            where: { idPedido: orderId},
            data: {
                cantCubiertos: data.cantidadCubiertos,
                observaciones: data.observacion,
            },
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: { 
                    include: { Usuarios: true } 
                }
            }
            })

            return this.toDomainEntity(updatedOrder);
        }else {
            const updatedOrder = await prisma.pedido.update({
            where: { idPedido: orderId},
            data: {
                cantCubiertos: data.cantidadCubiertos,
                observaciones: data.observacion,
                Linea_De_Pedido: {
                    update: lineNumber.map((line, index) => {
                        const item = data.items![index];
                        console.log(`OrderRepository.modifyOrder - Actualizando lÃnea ${line} con:`, item);
                        return {
                            where: {
                                idPedido_nroLinea: {
                                    idPedido: orderId,
                                    nroLinea: line
                                }
                            },
                            data: { 
                                cantidad: item.cantidad
                            }
                        }
                    })
                }
            },
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: { 
                    include: { Usuarios: true } 
                }
            }
            })

            return this.toDomainEntity(updatedOrder)
        }
    }

    public async deleteOrderLine(orderId: number, lineNumber: number): Promise<Order> {
        const partialDeletedOrder = await prisma.pedido.update({
            where: { idPedido: orderId },
            data: {
                Linea_De_Pedido: {
                    delete: {
                        idPedido_nroLinea: {
                            idPedido: orderId,
                            nroLinea: lineNumber
                        }
                    }
                }
            },
            include: {
                Mesa: true,
                Linea_De_Pedido: true,
                Mozos: { 
                    include: { Usuarios: true } 
                }
            }
        })

        return this.toDomainEntity(partialDeletedOrder)
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