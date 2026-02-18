// src/tests/automatic/generateQR.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

import { RegisterOrModifyQRUseCase } from "../../application/use_cases/QrUseCases/GenerateQRUseCase.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";

const mockQrTokenRepo = {
  createOrUpdate: vi.fn(),
};

const mockTableRepo = {
  getByNumTable: vi.fn(),
};

const mockWaiterRepo = {
  getWaiterById: vi.fn(),
};

vi.mock("../../infrastructure/database/repository/QrTokenRepository", () => ({
  QRTokenRepository: class {
    createOrUpdate = mockQrTokenRepo.createOrUpdate;
  },
}));

vi.mock("../../infrastructure/database/repository/TableRepository", () => ({
  TableRepository: class {
    getByNumTable = mockTableRepo.getByNumTable;
  },
}));

vi.mock("../../infrastructure/database/repository/WaiterRepository", () => ({
  WaiterRepository: class {
    getWaiterById = mockWaiterRepo.getWaiterById;
  },
}));

describe("Generate QR Use Case", () => {
  let generateQR: RegisterOrModifyQRUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    generateQR = new RegisterOrModifyQRUseCase();
  });

  it("debería generar un QR exitosamente", async () => {
    const nroMesa = 1;
    const idMozo = "mozo123";

    const existingWaiter = {
      id: idMozo,
      name: "Mozo de prueba",
      email: "mozo@prueba.com",
    };

    const existingTable = {
      id: 1,
      numTable: nroMesa,
      capacity: 4,
    };

    mockWaiterRepo.getWaiterById.mockResolvedValue(existingWaiter);
    mockTableRepo.getByNumTable.mockResolvedValue(existingTable);
    mockQrTokenRepo.createOrUpdate.mockResolvedValue(undefined);

    const result = await generateQR.execute(nroMesa, idMozo);

    expect(mockWaiterRepo.getWaiterById).toHaveBeenCalledWith(idMozo);
    expect(mockTableRepo.getByNumTable).toHaveBeenCalledWith(nroMesa);
    expect(mockQrTokenRepo.createOrUpdate).toHaveBeenCalledWith(
      nroMesa,
      idMozo,
      expect.any(String),
    );
    expect(result).toBeDefined();
  });

  it("debería lanzar un error si el mozo no existe", async () => {
    const nroMesa = 1;
    const idMozo = "mozo123";

    mockWaiterRepo.getWaiterById.mockResolvedValue(null);

    await expect(generateQR.execute(nroMesa, idMozo)).rejects.toThrow(
      new NotFoundError("No se encontro el mozo solicitado"),
    );

    expect(mockWaiterRepo.getWaiterById).toHaveBeenCalledWith(idMozo);
  });

  it("debería lanzar un error si la mesa no existe", async () => {
    const nroMesa = 1;
    const idMozo = "mozo123";

    const existingWaiter = {
      id: idMozo,
      name: "Mozo de prueba",
      email: "mozo@prueba.com",
    };

    mockWaiterRepo.getWaiterById.mockResolvedValue(existingWaiter);
    mockTableRepo.getByNumTable.mockResolvedValue(null);

    await expect(generateQR.execute(nroMesa, idMozo)).rejects.toThrow(
      new NotFoundError("No se encontro la mesa solicitada"),
    );

    expect(mockWaiterRepo.getWaiterById).toHaveBeenCalledWith(idMozo);
    expect(mockTableRepo.getByNumTable).toHaveBeenCalledWith(nroMesa);
  });
});
