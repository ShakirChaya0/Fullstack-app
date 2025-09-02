export default interface Policy {
  _minutosTolerancia: number;
  _horarioMaximoDeReserva: string;
  _horasDeAnticipacionParaCancelar: number;
  _horasDeAnticipacionParaReservar: number;
  _limiteDeNoAsistencias: number;
  _cantDiasDeshabilitacion: number;
  _porcentajeIVA: number;
  _montoCubiertosPorPersona: number;
}
