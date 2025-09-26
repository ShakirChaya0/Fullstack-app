import { Route, Routes, Navigate } from "react-router";
import { ClientRouter } from "./ClientRouter";
import { AdminRouter } from "./AdminRouter";
import { KitchenRouter } from "./KitchenRouter";
import useAuth from "../shared/hooks/useAuth";
import Login from "../features/Login/pages/Login";
import ResetPasswordForm from "../features/Login/pages/ResetPasswordForm";
import VerifyEmail from "../features/Login/pages/VerifyEmail";
import NotFoundPage from "../shared/components/NotFoundPage"
import ProtectedRoute from "../shared/components/ProtectedRoute";

export default function AppRouter() {
  const { isAuthenticated, user, isLoading } = useAuth();

  console.log("AppRouter - isAuthenticated:", isAuthenticated);
  console.log("AppRouter - user:", user);

  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {!isLoading &&  
            <>
                <Route path="/Cliente/*" element={
                    <ProtectedRoute userType={"Cliente"}>
                        <ClientRouter />
                    </ProtectedRoute>
                    }
                />
                <Route path="/Admin/*" element={
                    <ProtectedRoute userType={"Administrador"}>
                        <AdminRouter />
                    </ProtectedRoute>
                } />
                <Route path="/Cocina/*" element={
                    <ProtectedRoute userType={"SectorCocina"}>
                        <KitchenRouter />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />}/>
        </>}
        

    </Routes>
  );
}
