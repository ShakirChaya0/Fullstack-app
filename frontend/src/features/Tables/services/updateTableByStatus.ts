import type { statusTable } from "../types/TableTypes";

interface TablePropStatus {
    _tableNum: number,
    _state: statusTable
}

export async function updateTableByStatus(apiCall: (url: string, options?: RequestInit) => Promise<Response>, tableUpdate : TablePropStatus) {
    const res = await apiCall(`mesas/cambiarEstado/${tableUpdate._tableNum}`, {
        method: 'PATCH', 
        body: JSON.stringify({ statusTable: tableUpdate._state })
    })

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error);
    }
  
    if (res.status === 204) return;  // nada que parsear

    return res.json();
 
}