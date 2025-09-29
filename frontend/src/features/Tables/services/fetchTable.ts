import type { ITable } from "../interfaces/ITable";

export async function fetchGetAllTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<ITable[]> {
  const response = await apiCall("mesas");

  if (!response.ok) {
    throw new Error(`Error al listar las mesas: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCreateTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>, data: { capacity: number }): Promise<ITable> {
  const res = await apiCall("mesas", {
    method: "POST",
    body: JSON.stringify({ capacity: data.capacity }),
  });

  if (!res.ok) {
    throw new Error(`Error al crear mesa: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchUpdateTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>, numTable: number, data: { capacity: number }): Promise<ITable> {
  const res = await apiCall(`mesas/actualizarCapacidad/${numTable}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar mesa: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchDeleteTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>, numTable: number): Promise<void> {
  const res = await apiCall(`mesas/nromesa/${numTable}`, {
    method: "DELETE" });

  if (!res.ok) {
    throw new Error(`Error al eliminar mesa: ${res.status} ${res.statusText}`);
  }
}
