import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode }from 'jwt-decode';

export interface JwtPayloadInterface {
    idUsuario: string;
    email: string;
    tipoUsuario: UserType;
    username: string;
}

export type UserType = "Administrador" | "SectorCocina" | "Mozo" | "Cliente";

interface AuthContextType {
    isAuthenticated: boolean;
    user: JwtPayloadInterface | null;
    login: (token: string) => void;
    logout: () => void;
}

// Creamos el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el Proveedor
function AuthProvider({ children }: { children: React.ReactElement }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<JwtPayloadInterface | null>(null);

    // Lógica para el login: decodifica el token JWT y guarda la información
    const login = (token: string) => {
        try {
            const decodedUser = jwtDecode<JwtPayloadInterface>(token);
            setUser(decodedUser);
            setIsAuthenticated(true);
            // Opcionalmente, guarda el token en el almacenamiento local para persistencia
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.error("Error decodificando el JWT:", error);
            // Manejar error si el token es inválido
            logout();
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        // Eliminar el token del almacenamiento local al cerrar sesión
        localStorage.removeItem('authToken');
    };

    // Efecto para verificar la autenticación al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Verificar si el token es válido y no ha expirado
            try {
                const decodedUser = jwtDecode<JwtPayloadInterface>(token);
                // Aquí podrías agregar una verificación de expiración
                setUser(decodedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Token inválido o expirado:", error);
                logout(); // Si el token es inválido, cerrar sesión
            }
        }
    }, []);

    const value = { isAuthenticated, user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider };

// Creamos el Custom Hook
const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export { useAuth };