import type { ITable } from "../interfaces/ITable";

export async function getAllTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<ITable[]> {
  const response = await apiCall("mesas");

  if (!response.ok) {
    throw new Error(`Error al listar las mesas: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
