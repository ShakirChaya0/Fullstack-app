import type { ITable } from "../interfaces/ITable";

export async function getAllTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>): Promise<ITable[]> {
  const response = await apiCall("mesas");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
