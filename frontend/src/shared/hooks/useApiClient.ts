import useAuth from './useAuth';

export const useApiClient = () => {
    const { accessToken, refreshAccessToken, logout } = useAuth();

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

        try {
            let response = await makeRequest(accessToken);

            if (response.status === 401) {
                await refreshAccessToken();
                const newAccessToken = accessToken 

                if (newAccessToken) {
                    response = await makeRequest(newAccessToken);
                } else {
                    logout();
                    throw new Error('Sesión expirada. Por favor, inicie sesión de nuevo.');
                }
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    return { apiCall };
};

export default useApiClient;