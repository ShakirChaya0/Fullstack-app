export interface News {
    titulo: string,
    descripcion: string,
    fechaInicio: string,
    fechaFin: string
}
export interface PartialNews {
    titulo?: string,
    descripcion?: string,
    fechaInicio?: string,
    fechaFin?: string
}