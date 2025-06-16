import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const Productos = require("../mocks/products.json");
import { esComida } from '../utils/esComida.js';
const productos = Productos;
export class ProductModel {
}
ProductModel.getAll = () => {
    return productos;
};
ProductModel.getById = (id) => {
    const product = productos.find(prod => prod.idProducto == id);
    return product;
};
ProductModel.getByName = (name) => {
    const product = productos.filter(prod => prod.nombre.toLowerCase().includes(name.toLowerCase()));
    return product;
};
ProductModel.getByType = (tipo) => {
    // const product = productos.filter(prod => {
    //     if(esComida(prod)){
    //         prod.tipo == tipo
    //     }
    // })
    let product = [];
    productos.forEach((prod, index) => {
        if (esComida(prod) && prod.tipo.toLowerCase() == tipo) {
            product.push(prod);
        }
    });
    return product;
};
ProductModel.create = (data) => {
    const isValid = productos.findIndex(prod => prod.nombre.toLowerCase() == data.nombre.toLowerCase());
    if (isValid != -1)
        return { message: "Ya existe ese producto" };
    const newId = productos.length + 1;
    const product = {
        ...data,
        idProducto: newId
    };
    productos.push(product);
    return product;
};
ProductModel.update = (data, id) => {
    const index = productos.findIndex(prod => prod.idProducto == id);
    const newProduct = {
        ...productos[index],
        ...data
    };
    productos[index] = newProduct;
    return productos[index];
};
ProductModel.delete = (id) => {
    const index = productos.findIndex(prod => prod.idProducto == id);
    productos.splice(index, 1);
    return { message: "Producto eliminado con exito" };
};
