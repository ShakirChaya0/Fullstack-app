// src/tests/automatic/registerProduct.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CUU18RegisterProduct } from '../../application/use_cases/ProductsUseCases/CUU18RegisterProduct.js';
import { FoodType, ProductState } from '../../shared/types/SharedTypes.js';
import { ConflictError } from '../../shared/exceptions/ConflictError.js';

const mockProductRepo = {
    getByUniqueName: vi.fn(),
    create: vi.fn(),
};

vi.mock('../../infrastructure/database/repository/ProductRepository', () => ({
    ProductRepository: class {
        getByUniqueName = mockProductRepo.getByUniqueName;
        create = mockProductRepo.create;
    },
}));

describe('RegisterProduct Use Case', () => {
    let registerProduct: CUU18RegisterProduct;

    beforeEach(() => {
        vi.clearAllMocks();
        registerProduct = new CUU18RegisterProduct();
    });

    it('debería registrar un producto exitosamente', async () => {
        const productData = {
            nombre: "Test Product",
            descripcion: "Descripción del producto de prueba",
            precio: 100,
            estado: "Disponible" as ProductState,
            tipo: "Plato_Principal" as FoodType
        }

        const expectedProduct = {
            id: 1,
            ...productData
        };

        mockProductRepo.getByUniqueName.mockResolvedValue(null);
        mockProductRepo.create.mockResolvedValue(expectedProduct);

        const result = await registerProduct.execute(productData);

        expect(mockProductRepo.getByUniqueName).toHaveBeenCalledWith(productData.nombre);
        expect(mockProductRepo.create).toHaveBeenCalledWith(productData);
        expect(result).toEqual(expectedProduct);
    });

    it('debería lanzar un error si el producto ya existe', async () => {
        const productData = {
            nombre: "Test Product",
            descripcion: "Descripción del producto de prueba",
            precio: 100,
            estado: "Disponible" as ProductState,
            tipo: "Plato_Principal" as FoodType
        }

        mockProductRepo.getByUniqueName.mockResolvedValue(productData);

        await expect(registerProduct.execute(productData)).rejects.toThrow(new ConflictError(`Ya existe un producto con el nombre: ${productData.nombre}`));
    });
})