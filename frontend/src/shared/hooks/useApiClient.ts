import { toast } from 'react-toastify';
import useAuth from './useAuth';

export const useApiClient = () => {
    const { accessToken, refreshAccessToken, logout, isAuthenticated } = useAuth();

    const apiCall = async (url: string, options: RequestInit = {}) => {
        const makeRequest = async (token: string | null) => {
            return fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
                ...options,
                headers: {
                    ...options.headers,
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        };

        let response = await makeRequest(accessToken);

        if (response.status === 401) {
            // Si el usuario nunca estuvo autenticado (invitado), no mostrar alerta de sesión expirada
            if (!isAuthenticated && !accessToken) {
                return response;
            }

            const newAccessToken = await refreshAccessToken(); 

            if (newAccessToken) {
                response = await makeRequest(newAccessToken);

                console.log("REFRESH AUTOMATICO");
            } else {
                logout();
                toast.warn('Sesión expirada. Por favor, inicie sesión de nuevo.');
            }
        }

        return response;
    };

    return { apiCall };
};

export default useApiClient;