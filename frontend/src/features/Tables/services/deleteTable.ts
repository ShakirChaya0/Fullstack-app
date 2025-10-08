
export async function deleteTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>, numTable: number): Promise<void> {
  const res = await apiCall(`mesas/nromesa/${numTable}`, {
    method: "DELETE" });

  if (!res.ok) {
    throw new Error(`Error al eliminar mesa: ${res.status} ${res.statusText}`);
  }
}