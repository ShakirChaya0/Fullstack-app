import { Route, Routes } from "react-router";
import { lazy } from "react"; 
import useAuth from "../shared/hooks/useAuth";

// Routers
const ClientRouter = lazy(() => import("./ClientRouter"));
const AdminRouter = lazy(() => import("./AdminRouter"));
const KitchenRouter = lazy(() => import("./KitchenRouter"));
const WaiterRouter = lazy(() => import("./WaiterRouter"));

// Components and Pages
const ProtectedRoute = lazy(() => import("../shared/components/ProtectedRoute"));
const ResetPasswordForm = lazy(() => import("../features/Login/pages/ResetPasswordForm"));
const VerifyEmail = lazy(() => import("../features/Login/pages/VerifyEmail"));
const NotFoundPage = lazy(() => import("../shared/components/NotFoundPage"));
const Login = lazy(() => import("../features/Login/pages/Login"));

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
                        <ClientRouter />
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

                    <Route path="/Mozo/*" element={
                        <ProtectedRoute userType={"Mozo"}>
                            <WaiterRouter />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<NotFoundPage />}/>

            </>}
            
        </Routes>
    );
}
