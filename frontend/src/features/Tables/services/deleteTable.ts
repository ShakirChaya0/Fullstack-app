
export async function deleteTable(apiCall: (url: string, options?: RequestInit) => Promise<Response>, numTable: number): Promise<void> {
  const res = await apiCall(`mesas/nromesa/${numTable}`, {
    method: "DELETE" });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
}