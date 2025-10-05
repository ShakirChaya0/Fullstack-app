import { useEffect, useState } from "react";
import { TableList } from "../components/MesasTable";
import { useTables } from "../hooks/useTable";
import { ModalCreateTable } from "../components/ModalCreateTable";
import { ModalDeleteTable } from "../components/ModalDeleteTable";
import { ModalUpdateTable } from "../components/ModalUpdateTable";
import type { ITable } from "../interfaces/ITable";
import { fetchCreateTable, fetchDeleteTable, fetchUpdateTable } from "../services/fetchTable";
import { toast } from "react-toastify";
import useApiClient from "../../../shared/hooks/useApiClient";

export function TableCRUD () {
    
    const { tables, loading, error } = useTables(); 

    const { apiCall } = useApiClient()
    
    const handleCreateSave = async (data: {capacity: number}) => {
        try {
            const newTable = await fetchCreateTable(apiCall, data);
            setLocalTables(prev => [...prev, newTable]);
            toast.success('Mesa registrada exitosamente')
        } catch (error) {
            toast.error("No se pudo crear la mesa. Intente nuevamente.");
            console.log(error);
        }
    };
    
    const handleUpdateSave = async (numTable: number, data: { capacity: number }) => {
        try {
           const updated = await fetchUpdateTable(apiCall, numTable, data);
            setLocalTables(prev =>
               prev.map(t => (t._tableNum === numTable ? updated : t))
            );
            toast.success('Mesa modificada exitosamente');
            
        } catch (error) {
            toast.error("No se pudo modificar la mesa. Intente nuevamente.");
            console.log(error);
        }
    };
    
    const handleDeleteSave = async (numTable: number) => {
        try {
            setLoadingDelete(true);
            console.log(numTable)
            await fetchDeleteTable(apiCall, numTable);
            setLocalTables(prev => prev.filter(t => t._tableNum !== numTable));
            setDelete(null)
            toast.success("Mesa eliminada correctamente");
        } catch (error) {
            toast.error("No se pudo eliminar la mesa. Intente nuevamente.");
            console.log(error)
        } finally {
            setLoadingDelete(false);
        }
    };
 
    const [localTables, setLocalTables] = useState<ITable[]>([]);

    useEffect(() => {
        setLocalTables(tables ?? []);
    }, [tables]);

    const [openAdd, setAdd] = useState<boolean>(false)
    const [updatedTable, setUpdate] = useState<ITable | null>(null);
    const [deletedTable, setDelete] = useState<number | null>(null);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    
        if (loading) return <p>Cargando...</p>;
        if (error) return <p>Error: {error}</p>;
    
    return (
        <main className="flex flex-col items-center w-full ml-6 mr-6 min-h-screen">
            <TableList 
                tables = {localTables}
                onUpdate = {(table) => setUpdate(table)} 
                onDelete = {(numTable) => setDelete(numTable)} 
                onAdd = { () => setAdd(true) }
                >
            </TableList>
            {
                openAdd && (
                    <ModalCreateTable 
                        open = { openAdd } 
                        onClose = { () => setAdd(false) }
                        onSave = { handleCreateSave }
                    ></ModalCreateTable>
                )
            } 
            {
                updatedTable && (
                    <ModalUpdateTable
                        open = { updatedTable !== null }
                        table = { updatedTable }
                        onClose = { () => setUpdate(null) }
                        onSave = { handleUpdateSave } 
                    ></ModalUpdateTable>
                )
            } 
            {
                deletedTable !== null && (
                    <ModalDeleteTable
                        open = { deletedTable !== null }
                        numTable = { deletedTable }
                        loading = { loadingDelete }
                        onClose = { () => setDelete(null) }
                        onConfirm = { () => handleDeleteSave(deletedTable) }
                    ></ModalDeleteTable>
                )
            }
      </main>
    )
}