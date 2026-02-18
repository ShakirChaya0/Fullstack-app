export async function forgotPassword({ email, apiCall }: { email: string, apiCall: (url: string, options?: RequestInit) => Promise<Response> }) {
    const response = await apiCall("auth/forgotPassword", {
        method: "POST",
        body: JSON.stringify({
            email: email 
        })
    });

    if (!response.ok) {
        const data = await response.json(); 
        throw new Error(data.message || "Error al restablecer la contraseña");
    } 

    return
}