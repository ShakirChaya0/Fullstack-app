export interface News {
    titulo: string,
    descripcion: string,
    fechaInicio: Date,
    fechaFin: Date
}

export interface PartialNews {
    titulo?: string,
    descripcion?: string,
    fechaInicio?: Date,
    fechaFin?: Date
}