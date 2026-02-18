import type Information from "../interfaces/Information";

export default async function updateInformation(info: Information, apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<Information> {
  const response = await apiCall(
    `informacion/${info._informationId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        nombreRestaurante: info._name,
        direccionRestaurante: info._address,
        razonSocial: info._CompanyName,
        telefonoContacto: info._telefono
      }),
    }
  );

  if (!response.ok) throw new Error("Error al actualizar la información");

  return await response.json();
}
