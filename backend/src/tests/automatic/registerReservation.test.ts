// src/tests/automatic/registerReservation.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterReservation } from '../../application/use_cases/ReservationUseCases/RegisterReservationUseCase.js';
import { SchemaReservation } from '../../shared/validators/ReservationZod.js';

const mockReservationRepo = {
    getExistingReservation: vi.fn(),
    create: vi.fn(),
};

const mockClientRepo = {
    getClientByidUser: vi.fn(),
};

const mockTableRepo = {
    getAvailableTables: vi.fn(),
};

const mockPolicyRepo = {
    getPolicy: vi.fn(),
};

const mockScheduleRepo = {
    getById: vi.fn(),
};

vi.mock('../../infrastructure/database/repository/ReservationRepository', () => ({
    ReservationRepository: class {
        getExistingReservation = mockReservationRepo.getExistingReservation;
        create = mockReservationRepo.create;
    },
}));

vi.mock('../../infrastructure/database/repository/ClientRepository', () => ({
    ClientRepository: class {
        getClientByidUser = mockClientRepo.getClientByidUser;
    },
}));

vi.mock('../../infrastructure/database/repository/TableRepository', () => ({
    TableRepository: class {
        getAvailableTables = mockTableRepo.getAvailableTables;
    },
}));

vi.mock('../../infrastructure/database/repository/PolicyRepository', () => ({
    PolicyRepository: class {
        getPolicy = mockPolicyRepo.getPolicy;
    },
}));

vi.mock('../../infrastructure/database/repository/ScheduleRepositoy', () => ({
    ScheduleRepositoy: class {
        getById = mockScheduleRepo.getById;
    },
}));

describe('RegisterReservation Use Case', () => {
    let registerReservation: RegisterReservation;
    const clientId = 'client-123';
    
    beforeEach(() => {
        vi.clearAllMocks();
        registerReservation = new RegisterReservation();
    });
  
    it('debería crear una reserva exitosamente', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3); 
        
        const reservationData: SchemaReservation = {
            reserveDate: futureDate,
            reserveTime: '19:00',
            commensalsNumber: 4,
        };
      
        const mockPolicy = {
            horasDeAnticipacionParaReservar: 24,
        };
      
        const mockClient = {
            id: 'client-123',
            emailVerified: true,
            states: [
                {
                    state: 'Habilitado',
                    modifyDate: new Date('2024-01-01'),
                },
            ],
        };
      
        const mockSchedule = {
            id: 1,
            horaApertura: '12:00',
            horaCierre: '23:00',
        };
      
        const mockAvailableTables = [
            { id: 1, capacity: 4, tableNumber: 1 },
            { id: 2, capacity: 2, tableNumber: 2 },
            { id: 3, capacity: 6, tableNumber: 3 },
        ];
      
        const expectedReservation = {
            id: 'reservation-1',
            clientId,
            reserveDate: reservationData.reserveDate,
            reserveTime: reservationData.reserveTime,
            commensalsNumber: reservationData.commensalsNumber,
            tables: [mockAvailableTables[0]],
        };
      
        mockPolicyRepo.getPolicy.mockResolvedValue(mockPolicy);
        mockClientRepo.getClientByidUser.mockResolvedValue(mockClient);
        mockReservationRepo.getExistingReservation.mockResolvedValue(null);
        mockScheduleRepo.getById.mockResolvedValue(mockSchedule);
        mockTableRepo.getAvailableTables.mockResolvedValue(mockAvailableTables);
        mockReservationRepo.create.mockResolvedValue(expectedReservation);
      
        const result = await registerReservation.execute(reservationData, clientId);
      
        expect(result).toEqual(expectedReservation);
        expect(mockReservationRepo.create).toHaveBeenCalledWith(
            reservationData,
            clientId,
            [mockAvailableTables[0]]
        );
        expect(mockReservationRepo.create).toHaveBeenCalledTimes(1);
    });
});