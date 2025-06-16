import {createRequire} from "node:module"
const require = createRequire(import.meta.url)
const Productos = require("../mocks/products.json")

import { Comida, Bebida } from '../interfaces/productos.js'
import { esComida } from '../utils/esComida.js';
import { PartialSchemaProductos, SchemaProductos } from '../utils/validate.js';

const productos: (Comida | Bebida)[] = Productos as (Comida | Bebida)[];

export class ProductModel {

    static getAll = (): (Comida | Bebida)[] => {
        return productos
    }

    static getById = (id: number): Comida | Bebida | undefined => {
        const product = productos.find(prod => prod.idProducto == id)
        return product 
    }

    static getByName = (name: string): (Comida | Bebida | undefined)[] => {
        const product = productos.filter(prod => prod.nombre.toLowerCase().includes(name.toLowerCase()))
        return product
    }

    static getByType = (tipo: string): (Comida | undefined)[] => {
        // const product = productos.filter(prod => {
        //     if(esComida(prod)){
        //         prod.tipo == tipo
        //     }
        // })
        let product: (Comida | undefined)[] = [];

        productos.forEach((prod, index) => {
            if(esComida(prod) && prod.tipo.toLowerCase() == tipo){
                product.push(prod)
            }
        })
        return product
    }

    static create = (data: SchemaProductos): Comida | Bebida | {message: string} => {
        const isValid = productos.findIndex(prod => prod.nombre.toLowerCase() == data.nombre.toLowerCase())
        if(isValid != -1) return {message: "Ya existe ese producto"}
        const newId = productos.length + 1
        const product: Comida | Bebida = {
            ...data,
            idProducto: newId
        }
        productos.push(product)
        return product
    }
    
    static update = (data: PartialSchemaProductos, id: number): Comida | Bebida => {
        const index = productos.findIndex(prod => prod.idProducto == id)
        const newProduct = {
            ...productos[index],
            ...data
        }
        productos[index] = newProduct
        return productos[index]
    }

    static delete = (id: number): {message: string} => {
        const index = productos.findIndex(prod => prod.idProducto == id)
        productos.splice(index, 1)
        return {message: "Producto eliminado con exito"}
    }
}