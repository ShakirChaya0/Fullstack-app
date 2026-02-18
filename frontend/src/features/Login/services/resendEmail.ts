export async function resendEmail(apiCall: (url: string, options?: RequestInit) => Promise<Response>) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const response = await apiCall("auth/resendEmail", {
        method: "POST",
        body: JSON.stringify({ 
            token: token
        })
    });

    if (!response.ok) {
        const data = await response.json(); 
        throw new Error(data.message || "Error al verificar el correo");
    } 

    return
}