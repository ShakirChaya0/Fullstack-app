import type { UniqueProfileData, UserType } from "../types/ProfileSharedTypes";

export async function updateUser(userData: UniqueProfileData, userType: UserType, userId: string, apiCall: (url: string, options?: RequestInit) => Promise<Response>)
    : Promise<{ userData: UniqueProfileData, userType: UserType, verifiedEmail: boolean }> 
{
    let endpoint = userType === "Administrador" ? "administradores" :
        userType === "Cliente" ? "clientes" :
        userType === "Mozo" ? "mozos" :
        "cocina";

    endpoint += '/update';

    if (userType === "Mozo") endpoint += `/${userId}`

    const response = await apiCall(endpoint, {
        method: "PATCH",
        body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return { userData, userType, verifiedEmail: data.emailVerificado }
}