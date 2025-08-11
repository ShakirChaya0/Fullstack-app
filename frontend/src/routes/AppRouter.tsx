import { Routes } from "react-router"
import { ProductsRouter } from "./productsRouter"


function AppRouter () {
    return(
        <Routes>
            {ProductsRouter()}
        </Routes>
    )
}

export default AppRouter