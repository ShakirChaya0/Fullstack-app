import type { Client } from "../interfaces/Client";

export async function createUser(client: Client, apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<void> {
    const response = await apiCall("clientes", {
        method: "POST",
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