import type { UserType } from "../types/ProfileSharedTypes";

export async function getUserData(userId: string, userType: UserType, token: string) {
    const endpoint = userType === "Administrador" ? "administradores" :
        userType === "Cliente" ? `clientes/id/${userId}` :
        userType === "Mozo" ? `mozos/id/${userId}` : 
        "cocina";

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return data;
}