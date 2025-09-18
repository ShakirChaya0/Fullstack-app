import { Route, Routes, Navigate } from "react-router";
import { ClientRouter } from "./ClientRouter";
import { AdminRouter } from "./AdminRouter";
import { KitchenRouter } from "./KitchenRouter";
import useAuth from "../shared/hooks/useAuth";
import Login from "../features/Login/pages/Login";
import ResetPasswordForm from "../features/Login/pages/ResetPasswordForm";
import VerifyEmail from "../features/Login/pages/VerifyEmail";
import NotFoundPage from "../shared/components/NotFoundPage"

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
                <Route path="/verify-email" element={<VerifyEmail />} />
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
                <Route path="*" element={<NotFoundPage />}/>
            </>
        )}
    </Routes>
  );
}
