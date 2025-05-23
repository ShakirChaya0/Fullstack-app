import {ProductModel} from '../models/productModel.js'
import { ValidateProduct, ValidateProductPartial } from '../utils/validate.js'

export class ProductController {
    static getAll = () => {
        const productos = ProductModel.getAll()
        return productos
    }
    static getById = (id) => {
        console.log(id, typeof id)
        const producto = ProductModel.getById(id)
        return producto
    }
    static getByName = (name) => {
        const draft = name.replace(/_/g, ' ')
        const producto = ProductModel.getByName(draft)
        return producto
    }
    static getByType = (tipo) => {
        const draft = tipo.replace(/_/g, ' ')
        const producto = ProductModel.getByType(draft)
        return producto
    }
    static create = (data) => {
        const ProductData = ValidateProduct(data)
        if(!ProductData.success) return ProductData.error
        const draft = ProductModel.create(ProductData.data)
        return draft
    }
    static update = (data, id) => {
        const ProductData = ValidateProductPartial(data)
        if(!ProductData.success) return ProductData.error
        const draft = ProductModel.update(ProductData.data, id)
        return draft
    }
    static delete = (id) => {
        const producto = ProductModel.delete(id)
        return producto
    }
}