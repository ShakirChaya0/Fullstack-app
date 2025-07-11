export type estadoMesa = "Libre" | "Ocupado" | "Reservado";

export interface tableInterface {
    readonly nroMesa: number, 
    capacidad : number, 
    estado: estadoMesa
}