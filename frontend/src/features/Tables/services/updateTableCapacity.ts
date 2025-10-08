import type { ITable } from "../interfaces/ITable";

interface UpdateTablePayload {
  _tableNum: number;
  _capacity: number;
}

export async function updateTableCapacity(apiCall: (url: string, options?: RequestInit) => Promise<Response>, payload: UpdateTablePayload): Promise<ITable> {
  const res = await apiCall(`mesas/actualizarCapacidad/${payload._tableNum}`, {
    method: "PATCH",
    body: JSON.stringify({ capacity: payload._capacity }),
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar mesa: ${res.status} ${res.statusText}`);
  }
  return res.json();
}