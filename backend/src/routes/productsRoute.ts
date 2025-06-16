import {Router} from 'express'
import {ProductController} from '../controllers/productController.js'
import { TipoComida } from '../interfaces/productos.js'

export function productosRouter () {
    const productRouter = Router()

    productRouter.get('/', (req, res) => {
        const productos = ProductController.getAll()
        res.json(productos)
    })

    productRouter.get('/id/:idProducto', (req, res) => {
        const {idProducto} = req.params
        const producto = ProductController.getById(+idProducto)
        res.json(producto)
    })

    productRouter.get('/nombre/:nombre', (req, res) => {
        const {nombre} = req.params
        const producto = ProductController.getByName(nombre)
        res.json(producto)
    })

    productRouter.get('/tipo/:tipo', (req, res) => {
        const {tipo} = req.params
        const producto = ProductController.getByType(tipo as TipoComida)
        res.json(producto)
    })

    productRouter.post('/crearProducto', (req, res) => {
        const data = req.body
        const producto = ProductController.create(data)
        res.json(producto)
    })

    productRouter.patch('/actualizarProducto/:id', (req, res) => {
        const data = req.body
        const {id} = req.params
        const producto = ProductController.update(data, +id)
        res.json(producto)
    })

    productRouter.delete('/eliminarProducto/:id', (req, res) => {
        const {id} = req.params
        const producto = ProductController.delete(+id)
        res.json(producto)
    })

    return productRouter
}