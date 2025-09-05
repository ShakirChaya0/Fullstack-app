import type { ITable } from "../interfaces/ITable";

export async function fetchTable(): Promise<{Tables: ITable[]}> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mesas`);
    
    if(!response.ok) throw new Error("Error al Listar las mesas");

    const data = await response.json();
    return {
        Tables: data
    }
} 
