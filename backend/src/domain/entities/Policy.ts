export class Policy {
    constructor(
        private readonly _policyId: number,
        private _minutosTolerancia: number,
        private _horarioMaximoDeReserva: string, // Formato "HH:MM" (ej: "22:00")
        private _horasDeAnticipacionParaCancelar: number,
        private _horasDeAnticipacionParaReservar: number,
        private _limiteDeNoAsistencias: number,
        private _cantDiasDeshabilitacion: number,
        private _porcentajeIVA: number, // Decimal (ej: 21.0 para 21%)
        private _montoCubiertosPorPersona: number // Decimal para manejar centavos   
    ) {}

    public get idPolitica() { return this._policyId; }
    public get minutosTolerancia() { return this._minutosTolerancia; }  
    public get horarioMaximoDeReserva() { return this._horarioMaximoDeReserva; }
    public get horasDeAnticipacionParaCancelar() { return this._horasDeAnticipacionParaCancelar; }
    public get horasDeAnticipacionParaReservar() { return this._horasDeAnticipacionParaReservar; }
    public get limiteDeNoAsistencias() { return this._limiteDeNoAsistencias; }
    public get cantDiasDeshabilitacion() { return this._cantDiasDeshabilitacion; }
    public get porcentajeIVA() { return this._porcentajeIVA; }
    public get montoCubiertosPorPersona() { return this._montoCubiertosPorPersona; }

    public set minutosTolerancia(minutosTolerancia: number) { this._minutosTolerancia = minutosTolerancia }
    public set horarioMaximoDeReserva(horarioMaximoDeReserva: string) { this._horarioMaximoDeReserva = horarioMaximoDeReserva }
    public set horasDeAnticipacionParaCancelar(horasDeAnticipacionParaCancelar: number) { this._horasDeAnticipacionParaCancelar = horasDeAnticipacionParaCancelar }
    public set horasDeAnticipacionParaReservar(horasDeAnticipacionParaReservar: number) { this._horasDeAnticipacionParaReservar = horasDeAnticipacionParaReservar }
    public set limiteDeNoAsistencias(limiteDeNoAsistencias: number) { this._limiteDeNoAsistencias = limiteDeNoAsistencias }
    public set cantDiasDeshabilitacion(cantDiasDeshabilitacion: number) { this._cantDiasDeshabilitacion = cantDiasDeshabilitacion }
    public set porcentajeIVA(porcentajeIVA: number) { this._porcentajeIVA = porcentajeIVA }
    public set montoCubiertosPorPersona(montoCubiertosPorPersona: number) { this._montoCubiertosPorPersona = montoCubiertosPorPersona }
}