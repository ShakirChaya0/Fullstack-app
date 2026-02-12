// src/tests/automatic/generateCheck.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerateCheckUseCase } from '../../application/use_cases/OrderUseCases/GenerateCheckUseCase.js';
import { Order } from '../../domain/entities/Order.js';
import { OrderLine } from '../../domain/entities/OrderLine.js';
import { ProductoVO } from '../../domain/value-objects/ProductVO.js';
import { Table } from '../../domain/entities/Table.js';
import { WaiterPublicInfo } from '../../domain/interfaces/WaiterPublicInfo.js';
import { Information } from '../../domain/entities/Information.js';
import { Policy } from '../../domain/entities/Policy.js';
import { Check } from '../../domain/value-objects/Check.js';
import { NotFoundError } from '../../shared/exceptions/NotFoundError.js';
import { BusinessError } from '../../shared/exceptions/BusinessError.js';
import { ServerError } from '../../shared/exceptions/ServerError.js';

const mockOrderRepo = {
    getOne: vi.fn(),
    changeState: vi.fn(),
}

const mockInformationRepo = {
    getInformation: vi.fn(),
}

const mockPolicyRepo = {
    getPolicy: vi.fn(),
}

const mockCheckService = {
    generate: vi.fn(),
}

vi.mock('../../infrastructure/database/repository/OrderRepository', () => ({
    OrderRepository: class {
        getOne = mockOrderRepo.getOne;
        changeState = mockOrderRepo.changeState;
    },
}));

vi.mock('../../infrastructure/database/repository/InformationRepository', () => ({
    InformationRepository: class {
        getInformation = mockInformationRepo.getInformation;
    },
}));

vi.mock('../../infrastructure/database/repository/PolicyRepository', () => ({
    PolicyRepository: class {
        getPolicy = mockPolicyRepo.getPolicy;
    },
}));

vi.mock('../../application/services/CheckService', () => ({
    CheckService: class {
        generate = mockCheckService.generate;
    },
}));

describe('GenerateCheck Use Case', () => {
    let generateCheck: GenerateCheckUseCase;

    beforeEach(() => {
        vi.clearAllMocks();
        generateCheck = new GenerateCheckUseCase();

    });

    it('debería generar correctamente la cuenta', async () => {
        const information = new Information(1, "Nombre Bar", "Dirección Bar", "Nombre Compañía", "22223333");
        const policy = new Policy(1, 15, "22:00", 6, 6, 3, 7, 21, 10);
        const orderId = 1;
        const firstOrderedProduct = new ProductoVO("Prueba 1", 1, "Plato_Principal");
        const secondOrderedProduct = new ProductoVO("Prueba 2", 1, "Postre");
        const existingOrderLines: OrderLine[] = [
            new OrderLine(1, "Terminada", 1, firstOrderedProduct),
            new OrderLine(2, "Terminada", 1, secondOrderedProduct)
        ];
        const existingTable = new Table(1, 2, "Ocupada");
        const existingWaiter: WaiterPublicInfo = {
            nombre: "Nombre Mozo",
            apellido: "Apellido Mozo",
            username: "Mozo1"
        }
        const existingOrder = new Order(orderId, "22:00", "Completado", 10, "", existingOrderLines, existingTable, existingWaiter);
        const generatedCheck = new Check("Nombre Bar", "Dirección Bar", "Nombre Compañía", "22223333", 1, new Date(), "Nombre Mozo", 0, {
            idPedido: orderId,
            lines: [
                {
                    nombreProducto: "Prueba 1",
                    cantidad: 1,
                    montoUnitario: 1,
                    importe: 1
                },
                {
                    nombreProducto: "Prueba 2",
                    cantidad: 1,
                    montoUnitario: 1,
                    importe: 1
                }
            ],
            subtotal: 2,
            importeImpuestos: 0.42,
            total: 12.42
        });
        const expectedOrder = new Order(orderId, "22:00", "Pendiente_De_Pago", 10, "", existingOrderLines, existingTable, existingWaiter);

        mockOrderRepo.getOne.mockResolvedValue(existingOrder);
        mockInformationRepo.getInformation.mockResolvedValue(information);
        mockPolicyRepo.getPolicy.mockResolvedValue(policy);
        mockCheckService.generate.mockReturnValue(generatedCheck);
        mockOrderRepo.changeState.mockResolvedValue(expectedOrder);

        const { order, check } = await generateCheck.execute(orderId);

        expect(mockOrderRepo.getOne).toHaveBeenCalledWith(orderId);
        expect(mockInformationRepo.getInformation).toHaveBeenCalled();
        expect(mockPolicyRepo.getPolicy).toHaveBeenCalled();
        expect(mockCheckService.generate).toHaveBeenCalledWith(existingOrder, information, policy);
        expect(mockOrderRepo.changeState).toHaveBeenCalledWith(existingOrder, "Pendiente_De_Pago");
        expect({ order, check }).toEqual({ order: expectedOrder, check: generatedCheck });
    });

    it('debería lanzar un error si el pedido no existe', async () => {
        const orderId = 1;
        mockOrderRepo.getOne.mockResolvedValue(null);

        await expect(generateCheck.execute(orderId)).rejects.toThrow(new NotFoundError("Pedido no encontrado"));
        expect(mockOrderRepo.getOne).toHaveBeenCalledWith(orderId);
    });

    it('debería lanzar un error si el pedido no está completado', async () => {
        const orderId = 1;
        const existingOrder = new Order(orderId, "22:00", "En_Preparacion", 10, "", [], new Table(1, 2, "Ocupada"), { nombre: "Nombre Mozo", apellido: "Apellido Mozo", username: "Mozo1" });

        mockOrderRepo.getOne.mockResolvedValue(existingOrder);

        await expect(generateCheck.execute(orderId)).rejects.toThrow(new BusinessError("El pedido debe estar completado para ser pagado"));
        expect(mockOrderRepo.getOne).toHaveBeenCalledWith(orderId);
    });

    it('debería lanzar un error si el pedido no tiene mozo o mesa', async () => {
        const orderId = 1;
        const existingOrder = new Order(orderId, "22:00", "Completado", 10, "", [], undefined, undefined);

        mockOrderRepo.getOne.mockResolvedValue(existingOrder);

        await expect(generateCheck.execute(orderId)).rejects.toThrow(new ServerError("El Mozo o la Mesa del pedido no existe"));
        expect(mockOrderRepo.getOne).toHaveBeenCalledWith(orderId);
    });
});