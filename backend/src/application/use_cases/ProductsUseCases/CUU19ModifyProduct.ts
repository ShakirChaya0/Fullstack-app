import { Producto } from "@prisma/client";
import { Drink, Food, Product } from "../../../domain/entities/Product.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { PartialSchemaProductos } from '../../../presentation/validators/productZod.js';

export class CUU19ModifyProduct {
  constructor(
    private readonly productRepository = new ProductRepository()
  ) {}

  public async execute(idProducto: number, partialProduct: PartialSchemaProductos): Promise<Product> {
    const existingProduct = await this.productRepository.getById(idProducto);
    if (!existingProduct) {
      throw new Error(`Product with ID ${idProducto} not found`);
    }
    if (partialProduct?.nombre) {
      const existingProductByName = await this.productRepository.getByName(partialProduct.nombre);
      if (existingProductByName.length > 0) {
        throw new Error(`A product with the name ${partialProduct.nombre} already exists`);
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