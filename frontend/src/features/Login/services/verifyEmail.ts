export async function verifyEmail() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyEmail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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