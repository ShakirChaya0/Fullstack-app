import type Policy from "../interfaces/Policy";

export default async function updatePolicy(policy: Policy, apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<Policy> {
  const response = await apiCall(
    `politicas/id/${policy._policyId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        minutosTolerancia: policy._minutosTolerancia,
        horarioMaximoDeReserva: policy._horarioMaximoDeReserva,
        horasDeAnticipacionParaCancelar: policy._horasDeAnticipacionParaCancelar,
        horasDeAnticipacionParaReservar: policy._horasDeAnticipacionParaReservar,
        limiteDeNoAsistencias: policy._limiteDeNoAsistencias,
        cantDiasDeshabilitacion: policy._cantDiasDeshabilitacion,
        porcentajeIVA: policy._porcentajeIVA,
        montoCubiertosPorPersona: policy._montoCubiertosPorPersona,
      }),
    }
  );

  if (!response.ok) throw new Error("Error al actualizar la política");

  return await response.json();
}