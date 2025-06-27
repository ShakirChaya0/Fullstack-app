import express from 'express'
import {productosRouter} from './presentation/routes/productsRoute.js'
import cors from "cors"

const app = express()

const PORT = process.env.PORT ?? 3000

app.use(cors())

app.use(express.json())

app.use('/productos', productosRouter())

app.use((req, res) => {
    res.status(404).send("Error 404")
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})