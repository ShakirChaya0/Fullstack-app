import { Route, Routes } from "react-router"
import { ClientRouter } from "./ClientRouter"
import { AdminRouter } from "./AdminRouter"
import { KitchenRouter } from "./KitchenRouter"


function AppRouter () {
    return(
        <Routes>
            { ClientRouter() }
            { AdminRouter() }
            { KitchenRouter() }
            <Route path="*" element={<h1>404</h1>}/>
        </Routes>
    )
}

export default AppRouter