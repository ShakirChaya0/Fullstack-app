import { Route, Routes } from "react-router"
import { ClientRouter } from "./ClientRouter"
import { AdminRouter } from "./AdminRouter"
import { KitchenRouter } from "./KitchenRouter"
import NotFoundPage from "../shared/components/NotFoundPage"


function AppRouter () {
    return(
        <Routes>
            { ClientRouter() }
            { AdminRouter() }
            { KitchenRouter() }
            <Route path="*" element={<NotFoundPage />}/>
        </Routes>
    )
}

export default AppRouter