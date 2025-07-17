import express from 'express'
import cors from "cors"
import { ErrorHandler } from './presentation/middlewares/ErrorHandler.js'
import { productosRouter } from './presentation/routes/productsRoute.js'
import { NewsRouter } from './presentation/routes/newsRoute.js'
import { PolicyRouter } from './presentation/routes/policyRoute.js'
import { InformationRouter } from './presentation/routes/informationRoute.js'
import { horariosRouter } from './presentation/routes/scheduleRoute.js'
import { SuggestionsRouter } from './presentation/routes/suggestionsRoute.js'
import { WaiterRouter } from './presentation/routes/waiterRoute.js'
import { mesaRouter } from './presentation/routes/tableRoute.js'
import { NotFoundError } from './shared/exceptions/NotFoundError.js'
import { PricesRouter } from './presentation/routes/pricesRoute.js'
import { ClientRouter } from './presentation/routes/ClientRouter.js'
import { adminRouter } from './presentation/routes/adminRoute.js'
import { KitchenRouter } from './presentation/routes/kitchenRoute.js'
import cookieParser from 'cookie-parser'
import { AuthRouter } from './presentation/routes/authRoute.js'
import { AuthMiddleware } from './presentation/middlewares/AuthMiddleware.js'
import { ReservationRouter } from './presentation/routes/reservationRoute.js'

const app = express()

const PORT = process.env.PORT ?? 3000

app.use(cors())

app.use(express.json())

app.use(cookieParser())

app.use("/auth", AuthRouter())

app.use('/productos', productosRouter())

app.use("/novedades", NewsRouter())

app.use("/politicas", PolicyRouter())

app.use('/informacion', InformationRouter())

app.use('/horarios', horariosRouter())

app.use("/sugerencias", SuggestionsRouter())

app.use('/mozos', AuthMiddleware, WaiterRouter())

app.use('/mesas', mesaRouter())

app.use("/precios", PricesRouter())

app.use("/clientes", ClientRouter() )

app.use('/administradores', adminRouter())

app.use("/cocina", KitchenRouter())

app.use("/reservas", ReservationRouter());

app.use((req, res, next) => {
    const error =  new NotFoundError("Endpoint not found");
    next(error);
})

app.use(ErrorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})