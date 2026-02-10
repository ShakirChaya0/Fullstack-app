import express from 'express'
import cors from "cors"
import dotenv from 'dotenv';
import { createServer, Server as Http2Server } from 'node:http'
import { ErrorHandler } from './presentation/middlewares/ErrorHandler.js'
import { ProductosRouter } from './presentation/routes/ProductsRoute.js'
import { NewsRouter } from './presentation/routes/NewsRoute.js'
import { PolicyRouter } from './presentation/routes/PolicyRoute.js'
import { InformationRouter } from './presentation/routes/InformationRoute.js'
import { HorariosRouter } from './presentation/routes/ScheduleRoute.js'
import { SuggestionsRouter } from './presentation/routes/SuggestionsRoute.js'
import { WaiterRouter } from './presentation/routes/WaiterRoute.js'
import { MesaRouter } from './presentation/routes/TableRoute.js'
import { NotFoundError } from './shared/exceptions/NotFoundError.js'
import { PricesRouter } from './presentation/routes/PricesRoute.js'
import { ClientRouter } from './presentation/routes/ClientRouter.js'
import { AdminRouter } from './presentation/routes/AdminRoute.js'
import { KitchenRouter } from './presentation/routes/KitchenRoute.js'
import cookieParser from 'cookie-parser'
import { AuthRouter } from './presentation/routes/AuthRoute.js'
import { AuthMiddleware } from './presentation/middlewares/AuthMiddleware.js'
import { PaymentRouter } from './presentation/routes/PaymentRoute.js'
import { OrderRouter } from './presentation/routes/OrderRoute.js'
import { OptionalAuthMiddleware } from './presentation/middlewares/OptionalAuthMiddleware.js'
import { QrRoute } from './presentation/routes/QrRoute.js'
import { ReservationRouter } from './presentation/routes/ReservationRoute.js'
import { runReservationCheckJob } from './infrastructure/jobs/CheckReservationsJob.js'
import { SocketServerConnection } from './presentation/sockets/SocketServerConnection.js'
import { RoleMiddleware } from './presentation/middlewares/RoleMiddleware.js';

dotenv.config()
const app = express()

export const server: Http2Server = createServer(app)

SocketServerConnection(server)

const PORT = process.env.PORT ?? 3000

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}))

app.use(express.json())

app.use(cookieParser())

app.use("/auth", AuthRouter())

app.use('/productos', ProductosRouter())

app.use("/novedades", AuthMiddleware, NewsRouter())

app.use("/politicas", AuthMiddleware, RoleMiddleware(["Administrador"]), PolicyRouter()) 

app.use('/informacion', AuthMiddleware, RoleMiddleware(["Administrador"]), InformationRouter())

app.use('/horarios', HorariosRouter())

app.use("/sugerencias", SuggestionsRouter())

app.use('/mozos', AuthMiddleware, WaiterRouter())

app.use('/mesas', AuthMiddleware, MesaRouter())

app.use("/precios", AuthMiddleware, RoleMiddleware(["Administrador"]), PricesRouter())

app.use("/clientes", ClientRouter())

app.use('/administradores', AuthMiddleware, RoleMiddleware(["Administrador"]), AdminRouter())

app.use("/cocina", AuthMiddleware, RoleMiddleware(["Administrador", "SectorCocina"]), KitchenRouter())

app.use("/pagos", PaymentRouter())

app.use("/pedidos", OptionalAuthMiddleware, OrderRouter())

app.use("/qr", QrRoute())

app.use("/reservas", ReservationRouter())

app.use((req, res, next) => {
    const error =  new NotFoundError("Endpoint not found");
    next(error);
})

app.use(ErrorHandler)

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
    
    runReservationCheckJob();
})

export default app