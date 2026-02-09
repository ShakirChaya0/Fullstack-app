// src/tests/automatic/modifyProduct.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CUU19ModifyProduct } from '../../application/use_cases/ProductsUseCases/CUU19ModifyProduct.js';
import { PartialSchemaProductos } from '../../shared/validators/ProductZod.js';
import { ConflictError } from '../../shared/exceptions/ConflictError.js';
import { NotFoundError } from '../../shared/exceptions/NotFoundError.js';

const mockProductRepo = {
    getById: vi.fn(),
    getByUniqueName: vi.fn(),
    update: vi.fn(),
};

vi.mock('../../infrastructure/database/repository/ProductRepository', () => ({
    ProductRepository: class {
        getById = mockProductRepo.getById;
        getByUniqueName = mockProductRepo.getByUniqueName;
        update = mockProductRepo.update;
    },
}));

describe('ModifyProduct Use Case', () => {
    let modifyProduct: CUU19ModifyProduct;

    beforeEach(() => {
        vi.clearAllMocks();
        modifyProduct = new CUU19ModifyProduct();
    });

    it('debería modificar un producto exitosamente', async () => {
        const idProducto = 1;
        const existingProduct = {
            id: idProducto,
            name: "Existing Product",
            description: "Descripción del producto existente",
            state: "Disponible",
            price: 100,
            type: "Plato_Principal",
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: false
        }
        const partialProduct: PartialSchemaProductos = {
            nombre: "Nuevo nombre de prueba",
            descripcion: "Cambio de descripción de prueba" 
        }
        const expectedProduct = {
            ...existingProduct,
            ...partialProduct
        }

        mockProductRepo.getById.mockResolvedValue(existingProduct);
        mockProductRepo.getByUniqueName.mockResolvedValue(null);
        mockProductRepo.update.mockResolvedValue(expectedProduct);

        const result = await modifyProduct.execute(idProducto, partialProduct);

        expect(mockProductRepo.getById).toHaveBeenCalledWith(idProducto);
        expect(mockProductRepo.getByUniqueName).toHaveBeenCalledWith(partialProduct.nombre);
        expect(result).toEqual(expectedProduct);
    });

    it('debería lanzar un error si el producto no existe', async () => {
        const idProducto = 1;

        mockProductRepo.getById.mockResolvedValue(null);

        await expect(modifyProduct.execute(idProducto, {})).rejects.toThrow(new NotFoundError("Producto no encontrado"));
    });

    it('debería lanzar un error si el nombre del producto ya existe', async () => {
        const idProducto = 1;
        const existingProduct = {
            id: idProducto,
            name: "Existing Product",
            description: "Descripción del producto existente",
            state: "Disponible",
            price: 100,
            type: "Plato_Principal",
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: false
        }
        const sameNameProduct = {
            id: 2,
            name: "Same Name",
            description: "Descripción del producto repetido",
            state: "Disponible",
            price: 100,
            type: "Plato_Principal",
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: false

        }
        const partialProduct: PartialSchemaProductos = {
            nombre: "Same Name"
        }

        mockProductRepo.getById.mockResolvedValue(existingProduct);
        mockProductRepo.getByUniqueName.mockResolvedValue(sameNameProduct);

        await expect(modifyProduct.execute(idProducto, partialProduct)).rejects.toThrow(new ConflictError(`Ya existe un producto con el nombre: ${partialProduct.nombre}`));
    });
})