import express from 'express'
import cors from "cors"
import { ErrorHandler } from './presentation/middlewares/ErrorHandler.js'
import { productosRouter } from './presentation/routes/productsRoute.js'
import { NewsRouter } from './presentation/routes/newsRoute.js'
import { PolicyRouter } from './presentation/routes/policyRoute.js'
import { InformationRouter } from './presentation/routes/informationRoute.js'
import { SuggestionsRouter } from './presentation/routes/suggestionsRoute.js'
import { WaiterRouter } from './presentation/routes/waiterRoute.js'
import { NotFoundError } from './shared/exceptions/NotFoundError.js'

const app = express()

const PORT = process.env.PORT ?? 3000

app.use(cors())

app.use(express.json())

app.use('/productos', productosRouter())

app.use("/novedades", NewsRouter())

app.use("/politicas", PolicyRouter())

app.use('/informacion', InformationRouter())

app.use("/sugerencias", SuggestionsRouter())

app.use('/mozos', WaiterRouter())

app.use((req, res, next) => {
    const error =  new NotFoundError("Endpoint not found");
    next(error);
})

app.use(ErrorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})