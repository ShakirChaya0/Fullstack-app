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
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
}