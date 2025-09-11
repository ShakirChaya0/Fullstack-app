import { Route, Routes, Navigate } from "react-router";
import { ClientRouter } from "./ClientRouter";
import { AdminRouter } from "./AdminRouter";
import { KitchenRouter } from "./KitchenRouter";
import useAuth from "../shared/hooks/useAuth";
import Login from "../features/Login/pages/Login";
import ResetPasswordForm from "../features/Login/pages/ResetPasswordForm";

export default function AppRouter() {
    const { isAuthenticated, user } = useAuth();

    return (
        <>
            {!isAuthenticated && (  
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password" element={<ResetPasswordForm />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
                <p>{user?.tipoUsuario}</p>
                <p>{user?.tipoUsuario === 'Cliente'? 'Hola' : 'Chau'}</p>
            <Routes>
                {user?.tipoUsuario === 'Cliente' && <Route path="/Cliente" element={<ClientRouter />} />}
                {user?.tipoUsuario === 'Administrador' && <Route path="/Admin" element={<AdminRouter />} />}
                {user?.tipoUsuario === 'SectorCocina' && <Route path="/Cocina" element={<KitchenRouter />} />}
                <Route path="*" element={<h1>No tienes acceso o la página no existe</h1>} />
            </Routes>
        </>
    );
}
