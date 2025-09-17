import { Prisma } from "@prisma/client";
import prisma from "../prisma/PrismaClientConnection.js"
import { Client } from "../../../domain/entities/Client.js";
import { UUID } from 'crypto'
import { SchemaCliente, PartialClientSchema } from "../../../shared/validators/ClientZod.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { ClientState } from "../../../domain/entities/ClientState.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { Table } from "../../../domain/entities/Table.js";
import { ClientPublicInfo } from "../../../domain/interfaces/ClientPublicInfo.js";
import { IClienteRepository } from "../../../domain/repositories/IClientRepository.js";

type ClientWithUsuario = Prisma.ClientesGetPayload<{
    include: {
        Usuarios: true , 
        EstadosCliente: true,
        Reserva: {
            include : {
                Mesas_Reservas: {
                    include: {
                        Mesa:true
                    }
                }
            }
        }
    };
}>;

export class ClientRepository implements IClienteRepository {
    public async getAllClient(): Promise<Client[]> {
        const clients = await prisma.clientes.findMany({
            include: {
                Usuarios: true,
                EstadosCliente: true,
                Reserva: {
                    include: {
                        Mesas_Reservas: {
                            include: {
                                Mesa:true
                            }
                        }
                    }
                }
            }
        }); 
        return clients.map((client) => { return this.toDomainEntity(client) });
    }

    async getClientByidUser(id: string): Promise<Client | null> {
        const client = await prisma.clientes.findUnique({
            where: {
                idCliente: id
            },
            include: {
                Usuarios: true,
                EstadosCliente: {
                    orderBy: {
                        fechaActualizacion: 'desc' 
                    },
                    take: 1 
                },
                Reserva: {
                    include: {
                        Mesas_Reservas: {
                            include: {
                                Mesa: true
                            }
                        }
                    }
                }
            }
        });

        if(!client) return null; 

        return this.toDomainEntity(client);
    }

    public async getClientByUsername(username: string): Promise<Client | null> {
        const clientFound = await prisma.clientes.findFirst({
            where: {
                Usuarios: { nombreUsuario: username }
            },
            include: {
                Usuarios: true,
                EstadosCliente: true,
                Reserva: {
                    where: {
                        fechaReserva: {
                            gte: new Date()
                        },
                    },
                    include: {
                        Mesas_Reservas: {
                            include: {
                                Mesa: true,
                            },
                        },
                    },
                },
            },
        });

        if (!clientFound) return null; 
        
        return this.toDomainEntity(clientFound);
    } 
    
    async createClient(data: SchemaCliente): Promise<Client> {
        try {
            const newClient = await prisma.clientes.create({
                data: {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    telefono: data.telefono,
                    fechaNacimiento: data.fechaNacimiento,
                    emailVerificado: false,
                    Usuarios: {
                        create: {
                            nombreUsuario: data.nombreUsuario,
                            email: data.email,
                            contrasenia: data.contrasenia,
                            tipoUsuario: "Cliente"
                        }
                    }
                },
                include: {
                    Usuarios: true,
                    EstadosCliente: true,
                    Reserva: {
                        include: {
                            Mesas_Reservas: {
                                include: {
                                    Mesa:true
                                }
                            }
                        }
                    }
                }
            });
            return this.toDomainEntity(newClient);
        }
        catch (error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("Ya existe un Cliente con ese nombre de usuario");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
                throw new ConflictError("Ya existe un Cliente con ese email");
            }
            else {
                throw new ServiceError(`Error al crear el Cliente: ${error.message}`);
            }
        }
    }

    async updateClient(id: string, data: PartialClientSchema): Promise<Client> {
        try {
            await prisma.usuarios.update({
                where: { idUsuario: id },
                data: {
                    nombreUsuario: data.nombreUsuario,
                    email: data.email,
                    contrasenia: data.contrasenia
                }
            });

            const updatedClient = await prisma.clientes.update ({
                where: { idCliente: id }, 
                data: {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    telefono: data.telefono,
                    fechaNacimiento: data.fechaNacimiento,
                }, 
                include: {
                    Usuarios: true,
                    EstadosCliente: true,
                    Reserva: {
                        include: {
                            Mesas_Reservas: {
                                include: {
                                    Mesa: true
                                }
                            }
                        }
                    }
                }
            });
            return this.toDomainEntity(updatedClient);
        }
        catch(error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("El nombre de usuario ingresado ya está en uso");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
                throw new ConflictError("El email ingresado ya está en uso");
            }
            else {
                throw new ServiceError(`Error al actualizar datos del usuario: ${error.message}. Inténtelo de nuevo más tarde`);
            }
        }
    }

    public async verifyClientEmail(clientId: string): Promise<void> {
        await prisma.clientes.update({
            where: { idCliente: clientId },
            data: { emailVerificado: true }
        });
    }

    public async unverifyClientEmail(clientId: string): Promise<void> {
        await prisma.clientes.update({
            where: { idCliente: clientId },
            data: { emailVerificado: false }
        })
    }

    public async getClientByOtherDatas(clientPublicInfo: ClientPublicInfo): Promise<Client | null> {
        const client = await prisma.clientes.findFirst({
            where: {
                nombre: clientPublicInfo.nombre, 
                apellido: clientPublicInfo.apellido, 
                telefono: clientPublicInfo.telefono
            }, 
            include: {
                Usuarios: true , 
                EstadosCliente: true,
                    Reserva: {
                        include : {
                            Mesas_Reservas: {
                                include: {
                                    Mesa:true
                                }
                            }
                        }
                    }
            }
        }); 

        if(!client) return null;

        return this.toDomainEntity(client);
    }

    private toDomainEntity(client: ClientWithUsuario): Client {

        const clientPublicInfo: ClientPublicInfo = {
            nombre: client.nombre, 
            apellido: client.apellido, 
            telefono: client.telefono
        }

        const reservations = client.Reserva.map(reservation => {
            return new Reservation(
                reservation.idReserva, 
                reservation.fechaReserva,
                reservation.horarioReserva.toISOString().slice(11, 16), 
                reservation.fechaCancelacion, 
                reservation.cantidadComensales, 
                reservation.estado, 
                clientPublicInfo, 
                reservation.Mesas_Reservas.map(table => new Table (
                    table.Mesa.nroMesa, 
                    table.Mesa.capacidad, 
                    table.Mesa.estado
                ))
            )
        })

        const estados = client.EstadosCliente.map( state => { 
            return new ClientState(state.fechaActualizacion, state.estado)
        })

        return new Client(
            client.Usuarios.idUsuario as UUID,
            client.Usuarios.nombreUsuario,
            client.Usuarios.email,
            client.Usuarios.contrasenia,
            client.Usuarios.tipoUsuario,
            client.nombre,
            client.apellido,
            client.telefono, 
            client.fechaNacimiento,
            client.emailVerificado,
            estados, 
            reservations
        );  
    }

}