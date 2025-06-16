import express from 'express'
import {productosRouter} from './routes/productsRoute.js'

const app = express()

const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.use('/Productos', productosRouter())

app.use((req, res) => {
    res.status(404).send("Error 404")
})

app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})