// src/tests/automatic/registerOrder.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CUU02RegisterOrder } from '../../application/use_cases/OrderUseCases/RegisterOrderUseCase.js';

// private readonly orderRepository = new OrderRepository(),
// private readonly clientRepository = new ClientRepository(),
// private readonly qrTokenRepository = new QRTokenRepository(),
// private readonly tableRepository = new TableRepository(),
// private readonly productRepository = new ProductRepository()

const mockOrderRepo = {
    create: vi.fn(),
};

const mockClientRepo = {
    getClientByidUser: vi.fn(),
};

const mockQRTokenRepo = {
    getQRDataByToken: vi.fn(),
    revoke: vi.fn(),
};

const mockTableRepo = {
    getByNumTable: vi.fn(),
};

const mockProductRepo = {
    getByUniqueName: vi.fn(),
};

vi.mock('../../infrastructure/database/repository/OrderRepository', () => ({
    OrderRepository: class {
        create = mockOrderRepo.create;
    },
}));

vi.mock('../../infrastructure/database/repository/ClientRepository', () => ({
    ClientRepository: class {
        getClientByidUser = mockClientRepo.getClientByidUser;
    },
}));

vi.mock('../../infrastructure/database/repository/QRTokenRepository', () => ({
    QRTokenRepository: class {
        getQRDataByToken = mockQRTokenRepo.getQRDataByToken;
        revoke = mockQRTokenRepo.revoke;
    },
}));

vi.mock('../../infrastructure/database/repository/TableRepository', () => ({
    TableRepository: class {
        getByNumTable = mockTableRepo.getByNumTable;
    },
}));

vi.mock('../../infrastructure/database/repository/ProductRepository', () => ({
    ProductRepository: class {
        getByUniqueName = mockProductRepo.getByUniqueName;
    },
}));

describe('Register Order Use Case', () => {
    
    let registerOrder: CUU02RegisterOrder;    

    beforeEach(() => {
        vi.clearAllMocks();
        registerOrder = new CUU02RegisterOrder();
    });
})