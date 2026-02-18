import type { UserType } from "../types/ProfileSharedTypes";

export async function getUserData(userId: string, userType: UserType, apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const endpoint = userType === "Administrador" ? "administradores" :
        userType === "Cliente" ? `clientes/id/${userId}` :
        userType === "Mozo" ? `mozos/id/${userId}` : 
        "cocina";

    const response = await apiCall(endpoint);
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return data;
}