export interface PoliticyRestaurant {
    idPolitica: number;
    minutosTolerancia: number;
    horarioMaximoDeReserva: string; // Formato "HH:MM" (ej: "22:00")
    horasDeAnticipacionParaCancelar: number;
    horasDeAnticipacionParaReservar: number;
    limiteDeNoAsistencias: number;
    cantDiasDeshabilitacion: number;
    porcentajeIVA: number; // Decimal (ej: 21.0 para 21%)
    montoCubiertosPorPersona: number; // Decimal para manejar centavos
}
