import { Route, Routes, Navigate } from "react-router";
import { ClientRouter } from "./ClientRouter";
import { AdminRouter } from "./AdminRouter";
import { KitchenRouter } from "./KitchenRouter";
import { useAuth } from "../shared/hooks/useAuth"; 
import Login from "../features/Login/pages/Login";

function AppRouter() {
    // const { isAuthenticated, user } = useAuth();

    // if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    // }

    return (
        <Routes>
            {/* {user?.tipoUsuario === 'Cliente' && <Route path="/*" element={<ClientRouter />} />}
            {user?.tipoUsuario === 'Administrador' && <Route path="/*" element={<AdminRouter />} />}
            {user?.tipoUsuario === 'SectorCocina' && <Route path="/*" element={<KitchenRouter />} />}
             */}
            {/* <Route path="*" element={<h1>No tienes acceso o la página no existe</h1>} /> */}
        </Routes>
    );
}

export default AppRouter;