import { Route, Routes } from "react-router"
import { ClientRouter } from "./ClientRouter"
import { AdminRouter } from "./AdminRouter"


function AppRouter () {
    return(
        <Routes>
            { ClientRouter() }
            { AdminRouter() }
            <Route path="*" element={<h1>404</h1>}/>
        </Routes>
    )
}

export default AppRouter