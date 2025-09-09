
export interface Waiter {
    nombreUsuario: string,
    nombre: string,
    apellido: string,
    dni: string,
    telefono: string,
    email?: string,
    contrasenia?: string
    idMozo?: string
}

export type BackResults = {
    Waiters: Waiter[],
    pages: number,
    totalItems: number
}