export async function resetPassword({ newPassword, apiCall }: { newPassword: string, apiCall: (url: string, options?: RequestInit) => Promise<Response> }) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const response = await apiCall("auth/resetPassword", {
        method: "POST",
        body: JSON.stringify({ 
            newPassword: newPassword, 
            token: token
        })
    });

    if (!response.ok) {
        const data = await response.json(); 
        throw new Error(data.message || "Error al restablecer la contraseña");
    } 

    return
}