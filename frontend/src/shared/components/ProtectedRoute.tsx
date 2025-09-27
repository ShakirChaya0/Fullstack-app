import type { ReactElement } from "react";
import type { UserType } from "../contexts/AuthContext"; 
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router";

export default function ProtectedRoute({userType, children} : {userType: UserType, children: ReactElement}) {
    const { user } = useAuth();

    if (!user || user.tipoUsuario !== userType) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}