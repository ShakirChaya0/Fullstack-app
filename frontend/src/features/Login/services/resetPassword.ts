export async function resetPassword({ newPassword }: { newPassword: string }) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const response = await fetch("http://localhost:3000/auth/resetPassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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