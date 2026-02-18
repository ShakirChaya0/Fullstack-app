import type { StateClient } from "../../../shared/types/declarations";

export interface ClienteProp {
  nombreUsuario: string, 
  email: string, 
  nombre: string, 
  apellido: string,
  fechaNacimiento: Date,
  telefono: string, 
  estadoCliente: StateClient
}


export async function getClient(apiCall: (url: string, options?: RequestInit) => Promise<Response>, idUsuario: string ): Promise< ClienteProp> {
    const res = await apiCall(`clientes/id/${idUsuario}`)

    if(!res.ok) throw new Error("Error"); 

    return res.json();
}