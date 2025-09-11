export async function forgotPassword({ email }: { email: string }) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/forgotPassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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