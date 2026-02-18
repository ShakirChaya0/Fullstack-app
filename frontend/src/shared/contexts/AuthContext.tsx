import { createContext, useState, useEffect, type ReactElement } from 'react';
import { jwtDecode }from 'jwt-decode';
import { useNavigate } from 'react-router';

export interface JwtPayloadInterface {
    idUsuario: string;
    email: string;
    tipoUsuario: UserType;
    username: string;
}

export type UserType = "Administrador" | "SectorCocina" | "Mozo" | "Cliente";

interface AuthContextType {
    user: JwtPayloadInterface | null,
    setUser: (user: JwtPayloadInterface | null) => void,
    accessToken: string | null, 
    login: (email: string, password: string) => Promise<{ success: boolean; error?: undefined; } | { success: boolean; error: any; } | undefined>,
    logout: () => void,
    refreshAccessToken: () => Promise<string | null>,
    isLoading: boolean,
    isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState<JwtPayloadInterface | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        refreshAccessToken();
    }, []);

    const refreshAccessToken = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                setAccessToken(data.token);
                
                const userData: JwtPayloadInterface = jwtDecode(data.token);
                setUser(userData);

                return data.token
            }

            return null;
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                setAccessToken(data.token);
                
                const userData: JwtPayloadInterface = jwtDecode(data.token);
                setUser(userData);

                if (userData?.tipoUsuario === "Cliente") navigate("/Cliente");
                else if (userData?.tipoUsuario === "Administrador") navigate("/Admin");
                else if (userData?.tipoUsuario === "SectorCocina") navigate("/Cocina");
                else if (userData?.tipoUsuario === "Mozo") navigate("/Mozo");

                return { success: true };
            }
            else {
                throw new Error(data.message || "Error desconocido");
            }
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Error desconocido");
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

  return (
    <AuthContext.Provider value={{ 
        user,
        setUser, 
        accessToken, 
        login, 
        logout, 
        refreshAccessToken,
        isLoading,
        isAuthenticated: !!accessToken 
    }}>
        {children}
    </AuthContext.Provider>
  );
};
