export type stateTable = "Libre" | "Ocupado" | "Reservado";

export interface tableInterface {
    readonly nroMesa: number, 
    capacidad : number, 
    estado: stateTable
}