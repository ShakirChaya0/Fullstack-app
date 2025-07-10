import express from 'express'
import {productosRouter} from './presentation/routes/productsRoute.js'
import cors from "cors"
import { NewsRouter } from './presentation/routes/newsRoute.js'
import { PolicyRouter } from './presentation/routes/policyRoute.js'
import { InformationRouter } from './presentation/routes/informationRoute.js'
import { horariosRouter } from './presentation/routes/scheduleRoute.js'

const app = express()

const PORT = process.env.PORT ?? 3000

app.use(cors())

app.use(express.json())

app.use('/productos', productosRouter())

app.use("/novedades", NewsRouter())

app.use("/politicas", PolicyRouter())

app.use('/informacion', InformationRouter())

app.use('/horarios', horariosRouter())

app.use((req, res) => {
    res.status(404).send("Error 404")
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})