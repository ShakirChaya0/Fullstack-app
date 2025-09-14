import type { UniqueProfileData, UserType } from "../types/ProfileSharedTypes";

export async function updateUser(userData: UniqueProfileData, userType: UserType, token: string): Promise<void> {
    let endpoint = userType === "Administrador" ? "administradores" :
        userType === "Cliente" ? "clientes" :
        userType === "Mozo" ? "mozos" :
        "cocina";

    endpoint += '/update';

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return
}