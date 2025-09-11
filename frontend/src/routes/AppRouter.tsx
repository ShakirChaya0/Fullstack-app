import { Route, Routes, Navigate } from "react-router";
import { ClientRouter } from "./ClientRouter";
import { AdminRouter } from "./AdminRouter";
import { KitchenRouter } from "./KitchenRouter";
import useAuth from "../shared/hooks/useAuth";
import Login from "../features/Login/pages/Login";
import ResetPasswordForm from "../features/Login/pages/ResetPasswordForm";

export default function AppRouter() {
  const { isAuthenticated, user, isLoading } = useAuth();

  console.log("AppRouter - isAuthenticated:", isAuthenticated);
  console.log("AppRouter - user:", user);

  return (
    <Routes>
        {!isAuthenticated && !isLoading && (
            <>
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </>
        )}

        {isAuthenticated && user && (
            <>
                {user.tipoUsuario === "Cliente" && (
                    <Route path="/*" element={<ClientRouter />} />
                )}
                {user.tipoUsuario === "Administrador" && (
                    <Route path="/*" element={<AdminRouter />} />
                )}
                {user.tipoUsuario === "SectorCocina" && (
                    <Route path="/*" element={<KitchenRouter />} />
                )}
                <Route path="*" element={<h1>No tienes acceso o la página no existe</h1>} />
            </>
        )}
    </Routes>
  );
}
