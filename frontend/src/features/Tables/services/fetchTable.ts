import type { ITable } from "../interfaces/ITable";

export async function fetchGetAllTable(): Promise<ITable[]> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mesas`);

  if (!response.ok) {
    throw new Error("Error al listar las mesas");
  }

  return response.json();
}

export async function fetchCreateTable(data: {capacity: number}):Promise<ITable>{
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mesas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ capacity: data.capacity }),
  });
  if (!res.ok){
    console.error("Error en la API:", res.status, res);
    throw new Error("Error al crear mesa");
  }
  return res.json();
}

export async function fetchUpdateTable(numTable: number, data: { capacity: number }): Promise<ITable> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mesas/${numTable}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar mesa");
  return res.json();
}

export async function fetchDeleteTable(numTable: number): Promise<void> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mesas/${numTable}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar mesa");
}