import type Information from "../interfaces/Information";

export default async function updateInformation(info: Information): Promise<Information> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/informacion/${info._informationId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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
