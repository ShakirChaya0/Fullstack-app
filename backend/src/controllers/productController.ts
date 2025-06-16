import {ProductModel} from '../models/productModel.js'
import { SchemaProductos, ValidateProduct, ValidateProductPartial } from '../utils/validate.js'
import { Comida, Bebida, TipoComida, Update} from '../interfaces/productos.js'
import { ZodError } from 'zod'
import { productUpdateValidation } from '../utils/updateValidate.js'


export class ProductController {
    static getAll = (): (Comida | Bebida)[] => {
        const productos = ProductModel.getAll()
        return productos
    }

    static getById = (id: number): Comida | Bebida | undefined => {
        const producto = ProductModel.getById(id)
        return producto
    }

    static getByName = (name: string): (Comida | Bebida | undefined)[] => {
        const draft = name.replace(/_/g, ' ')
        const producto = ProductModel.getByName(draft)
        return producto
    }

    static getByType = (tipo: TipoComida): (Comida | undefined)[] => {
        const draft = tipo.replace(/_/g, ' ')
        const producto = ProductModel.getByType(draft)
        return producto
    }

    static create = (data: Comida | Bebida): (Comida | Bebida) | {message: string} => {
        const ProductData = ValidateProduct(data)
        if(!ProductData.success) return ProductData.error
        const draft = ProductModel.create(ProductData.data)
        return draft
    }

    static update = (data: Update, id: number): (Comida | Bebida) | {message: string} => {
        const resultData = productUpdateValidation(data, id)
        if(!resultData) return {message: "Datos inválidos"}

        const ProductData = ValidateProductPartial(data.datos)
        if(!ProductData.success) return ProductData.error

        const draft = ProductModel.update(ProductData.data, id)
        return draft
    }

    static delete = (id: number) => {
        const producto = ProductModel.delete(id)
        return producto
    }
}