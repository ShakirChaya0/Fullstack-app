import { randomUUID } from 'node:crypto'
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)
const Productos = require('../mocks/products.json')
// import Productos from '../mocks/products.json' assert {type: json}

export class ProductModel {
    static getAll = () => {
        return Productos
    }
    static getById = (id) => {
        const product = Productos.filter(prod => prod.idProducto == id)
        return product 
    }
    static getByName = (name) => {
        const product = Productos.filter(prod => prod.nombre.toLowerCase().includes(name.toLowerCase()))
        return product
    }
    static getByType = (tipo) => {
        const product = Productos.filter(prod => prod.tipo == tipo)
        return product
    }
    static create = (data) => {
        const isValid = Productos.findIndex(prod => prod.nombre.toLowerCase() == data.nombre.toLowerCase())
        if(isValid != -1) return {message: "Ya existe ese producto"}
        const newId = Productos.length
        const product = {
            idProducto: newId,
            ...data
        }
        Productos.push(product)
        return product
    }
    static update = (data, id) => {
        const index = Productos.findIndex(prod => prod.idProducto == id)
        const newProduct = {
            ...Productos[index],
            ...data
        }
        Productos[index] = newProduct
        return Productos[index]
    }
    static delete = (id) => {
        const index = Productos.findIndex(prod => prod.idProducto == id)
        Productos.splice(index, 1)
        return {message: "Producto eliminado con exito"}
    }
}