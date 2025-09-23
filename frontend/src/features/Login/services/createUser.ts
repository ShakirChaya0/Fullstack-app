import type { Client } from "../interfaces/Client";

export async function createUser(client: Client): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clientes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...client
        })
    });

    if (!response.ok) {
        const data = await response.json(); 
        throw new Error(data.message || { message: "Error crear la cuenta" });
    } 

    return
}