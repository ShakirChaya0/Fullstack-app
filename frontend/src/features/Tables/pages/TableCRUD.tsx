import { useEffect, useState } from "react";
import { TableList } from "../components/MesasTable";
import { useTables } from "../hooks/useTable";
import { ModalCreateTable } from "../components/ModalCreateTable";
import { ModalDeleteTable } from "../components/ModalDeleteTable";
import { ModalUpdateTable } from "../components/ModalUpdateTable";
import type { ITable } from "../interfaces/ITable";

export function TableCRUD () {
    
    const { tables, loading, error } = useTables(); 
    
    const handleCreateSave = () => {
        try {
            //Llamo a la API
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleUpdateSave = () => {
        try {
            console.log('Estoy en el Padre para actualizar en la API')
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleDeleteSave = async (numTable: number) => {
        try {
            console.log('Se elimino la mesa:' , numTable)
        } catch (error) {
            console.log(error)
        }
    }
 

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
        <main className="flex flex-col items-center w-full ml-6 mr-6">
            <TableList 
                tables = {tables}
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
                deletedTable && (
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