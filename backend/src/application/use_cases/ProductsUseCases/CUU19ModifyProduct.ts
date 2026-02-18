import { Product } from "../../../domain/entities/Product.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { PartialSchemaProductos } from '../../../shared/validators/ProductZod.js';
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { Food } from "../../../domain/entities/Food.js";
import { Drink } from "../../../domain/entities/Drink.js";

export class CUU19ModifyProduct {
  constructor(
    private readonly productRepository = new ProductRepository()
  ) {}

  public async execute(idProducto: number, partialProduct: PartialSchemaProductos): Promise<Product> {
    const existingProduct = await this.productRepository.getById(idProducto);

    if (!existingProduct) {
      throw new NotFoundError("Producto no encontrado");
    }
    
    if (partialProduct?.nombre) {
      const existingProductByName = await this.productRepository.getByUniqueName(partialProduct.nombre);
      if (existingProductByName) {
        throw new ConflictError(`Ya existe un producto con el nombre: ${partialProduct.nombre}`);
      }
    }

    let updatedProduct: PartialSchemaProductos = {};
    if (existingProduct instanceof Food) {
      updatedProduct = {
        nombre: partialProduct.nombre ?? existingProduct.name,
        descripcion: partialProduct.descripcion ?? existingProduct.description,
        estado: partialProduct.estado ?? existingProduct.state,
        tipo: partialProduct.tipo ?? existingProduct.type,
        esVegetariana: partialProduct.esVegetariana ?? existingProduct.isVegetarian,
        esVegana: partialProduct.esVegana ?? existingProduct.isVegan,
        esSinGluten: partialProduct.esSinGluten ?? existingProduct.isGlutenFree
      };
    } else if (existingProduct instanceof Drink) {
      updatedProduct = {
        nombre: partialProduct.nombre ?? existingProduct.name,
        descripcion: partialProduct.descripcion ?? existingProduct.description,
        estado: partialProduct.estado ?? existingProduct.state,
        esAlcoholica: partialProduct.esAlcoholica ?? existingProduct.isAlcoholic
      }
    }

    const productoDatabase = await this.productRepository.update(updatedProduct, idProducto);
    return productoDatabase;
  }
}