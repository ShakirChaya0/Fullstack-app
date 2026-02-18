// tests/integration/orders.integration.test.ts
import { describe, it, expect, afterAll } from "vitest";
import prisma from "../../infrastructure/database/prisma/PrismaClientConnection.js";
import request from "supertest";
import app from "../../App.js";
import { JWTService } from "../../application/services/JWTService.js";

describe("Registration Integration Tests", () => {
    let testUserId: string;
    let testUserName = "integrationtestuser";

    afterAll(async () => {
        await prisma.estadosCliente.deleteMany({
            where: {
                Clientes: {
                    Usuarios: {
                        email: "pruebaIntegrationTest@gmail.com",
                    },
                },
            },
        });
        await prisma.clientes.deleteMany({
            where: {
                Usuarios: {
                    email: "pruebaIntegrationTest@gmail.com",
                },
            },
        });
        await prisma.usuarios.delete({
            where: { email: "pruebaIntegrationTest@gmail.com" },
        });
        await prisma.$disconnect();
    });

    describe("POST /clientes", () => {
        it("debería crear un nuevo cliente", async () => {
            const clientData = {
                nombreUsuario: testUserName,
                contrasenia: "TestPass123",
                nombre: "Test",
                apellido: "User",
                fechaNacimiento: "01/01/1990",
                telefono: "1234567890",
                email: "pruebaIntegrationTest@gmail.com",
            };

            await request(app)
                .post("/clientes")
                .send(clientData)
                .expect(201);


            const newUser = await prisma.usuarios.findUnique({
                where: { email: clientData.email },
                include: {
                    Clientes: {
                        include: {
                            EstadosCliente: {
                                orderBy: {
                                    fechaActualizacion: "desc",
                                },
                                take: 1,
                            },
                        },
                    },
                },
            });

            testUserId = newUser?.idUsuario || "";

            expect(newUser).not.toBeNull();
            expect(newUser?.Clientes).toMatchObject({
                idCliente: expect.any(String),
                nombre: clientData.nombre,
                apellido: clientData.apellido,
                telefono: clientData.telefono,
                fechaNacimiento: expect.any(Date),
                emailVerificado: false,
            });
            expect(newUser?.Clientes?.EstadosCliente[0]).toMatchObject({
                fechaActualizacion: expect.any(Date),
                estado: "Habilitado",
            });
        });

        it("debería retornar error si el email ya existe", async () => {
            let clientId = "11111111-1111-1111-1111-111111111111";

            const clientData = {
                idCliente: clientId,
                nombreUsuario: "anotheruser",
                contrasenia: "AnotherPass123",
                nombre: "Another",
                apellido: "User",
                fechaNacimiento: "02/02/1992",
                telefono: "0987654321",
                email: "pruebaIntegrationTest@gmail.com", // Mismo email que el test anterior
            };

            await request(app).post("/clientes").send(clientData).expect(409);

            const existingClient = await prisma.clientes.findUnique({
                where: { idCliente: clientId },
                include: {
                    Usuarios: true,
                    EstadosCliente: {
                        orderBy: {
                            fechaActualizacion: "desc",
                        },
                        take: 1,
                    },
                },
            });

            expect(existingClient).toBeNull();
        });

        it("debería retornar error si el nombre de usuario ya existe", async () => {
            let clientId = "22222222-2222-2222-2222-222222222222";

            const clientData = {
                idCliente: clientId,
                nombreUsuario: testUserName, // Mismo nombre de usuario que el test anterior
                contrasenia: "AnotherPass123",
                nombre: "Another",
                apellido: "User",
                fechaNacimiento: "02/02/1992",
                telefono: "0987654321",
                email: "anotheremail@example.com",
            };

            await request(app).post("/clientes").send(clientData).expect(409);

            const existingClient = await prisma.clientes.findUnique({
                where: { idCliente: clientId },
                include: {
                    Usuarios: true,
                    EstadosCliente: {
                        orderBy: {
                            fechaActualizacion: "desc",
                        },
                        take: 1,
                    },
                },
            });

            expect(existingClient).toBeNull();
        });
    });

    describe("PATCH /clientes/update", () => {
        it("debería poder actualizar los datos de un cliente", async () => {
            const jwtService = new JWTService();
            const token = jwtService.generateAccessToken({
                idUsuario: testUserId as any,
                email: "pruebaIntegrationTest@gmail.com",
                tipoUsuario: "Cliente",
                username: testUserName,
            });

            const newClientData = {
                telefono: "1112223333",
                nombre: "UpdatedName",
                apellido: "UpdatedSurname",
            }

            const response = await request(app)
                .patch("/clientes/update")
                .set("Authorization", `Bearer ${token}`)
                .send(newClientData)
                .expect(201);

            expect(response.body).toMatchObject({
                nombreUsuario: testUserName,
                nombre: "UpdatedName",
                apellido: "UpdatedSurname",
                fechaNacimiento: expect.any(String),
                telefono: "1112223333",
                email: "pruebaIntegrationTest@gmail.com",
                emailVerificado: expect.any(Boolean),
            });
        });
    });

    describe("GET /clientes", () => {
        it("debería recuperar todos los clientes registrados", async () => {
            const jwtService = new JWTService();
            const token = jwtService.generateAccessToken({
                idUsuario: testUserId as any,
                email: "pruebaIntegrationTest@gmail.com",
                tipoUsuario: "Administrador",
                username: testUserName,
            });

            const response = await request(app)
                .get("/clientes")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toMatchObject({
                nombreUsuario: expect.any(String),
                nombre: expect.any(String),
                apellido: expect.any(String),
                fechaNacimiento: expect.any(String),
                telefono: expect.any(String),
                email: expect.any(String),
                estados: expect.any(Array),
            });
        });
    });

    describe("GET /clientes/id:idUsuario", () => {
        it("debería recuperar un cliente con su ID", async () => {
            const jwtService = new JWTService();
            const token = jwtService.generateAccessToken({
                idUsuario: testUserId as any,
                email: "pruebaIntegrationTest@gmail.com",
                tipoUsuario: "Cliente",
                username: testUserName,
            });

            const response = await request(app)
                .get(`/clientes/id/${testUserId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body).not.toBeNull();
            expect(response.body).toMatchObject({
                nombreUsuario: testUserName,
                nombre: "UpdatedName",
                apellido: "UpdatedSurname",
                fechaNacimiento: expect.any(String),
                telefono: "1112223333",
                email: "pruebaIntegrationTest@gmail.com",
                estadoCliente: expect.any(Array),
            });
        });
    });

    describe("GET /clientes/nombreUsuario/:nombreUsuario", () => {
        it("debería recuperar un cliente con su nombre de usuario", async () => {
            const jwtService = new JWTService();
            const token = jwtService.generateAccessToken({
                idUsuario: testUserId as any,
                email: "pruebaIntegrationTest@gmail.com",
                tipoUsuario: "Cliente",
                username: testUserName,
            });

            const response = await request(app)
                .get(`/clientes/nombreUsuario/${testUserName}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body).not.toBeNull();
            expect(response.body).toMatchObject({
                nombreUsuario: testUserName,
                nombre: "UpdatedName",
                apellido: "UpdatedSurname",
                fechaNacimiento: expect.any(String),
                telefono: "1112223333",
                email: "pruebaIntegrationTest@gmail.com",
            });
        });
    });
});