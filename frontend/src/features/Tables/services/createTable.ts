import type { ITable } from "../interfaces/ITable";

export async function createTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>, capacity: number ): Promise<ITable> {
  const res = await apiCall("mesas", {
    method: "POST",
    body: JSON.stringify({ capacity: capacity }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
}
