import { useState, useEffect } from "react";
import { TableList } from "../components/MesasTable";
import { ModalCreateTable } from "../components/ModalCreateTable";
import { ModalDeleteTable } from "../components/ModalDeleteTable";
import { ModalUpdateTable } from "../components/ModalUpdateTable";
import type { ITable } from "../interfaces/ITable";
import { useTables } from "../hooks/useTable";
import { useTableMutation } from "../hooks/useTableMutation";

export default function TableCRUD() {
  const { data: tables, isLoading, error } = useTables(); 
  const { mutateAsync } = useTableMutation();

  const [localTables, setLocalTables] = useState<ITable[]>([]);
  const [openAdd, setAdd] = useState<boolean>(false);
  const [updatedTable, setUpdate] = useState<ITable | null>(null);
  const [deletedTable, setDelete] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  // Mantener el estado local sincronizado con los datos de la query
  useEffect(() => {
    setLocalTables(tables ?? []);
  }, [tables]);

  // Crear mesa
  const handleCreateSave = async (data: { capacity: number }) => {
    try {
      const newTable = await mutateAsync({ action: "create", _capacity: data.capacity });
      if (newTable) setLocalTables(prev => [...prev, newTable]);
    } catch (err) {
      console.error(err);
    }
  };

  // Actualizar mesa (capacidad)
  const handleUpdateSave = async (tableNum: number, data: { capacity?: number; state?: 'Libre' | 'Ocupada' }) => {
    try {
      const updated = await mutateAsync({ action: "updateCapacity", _tableNum: tableNum, _capacity: data.capacity, _state: data.state});
      if (updated) setLocalTables(prev => prev.map(t => t._tableNum === tableNum ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar mesa
  const handleDeleteSave = async (tableNum: number) => {
    try {
      setLoadingDelete(true);
      await mutateAsync({ action: "delete", _tableNum: tableNum });
      setLocalTables(prev => prev.filter(t => t._tableNum !== tableNum));
      setDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  if (isLoading) return <p>Cargando mesas...</p>;
  if (error) return <p>Error al cargar mesas: {error.message}</p>;

  return (
    <>
      <div className="flex flex-col items-center w-full ml-6 mr-6 min-h-screen">
        <TableList
          tables={localTables}
          onUpdate={table => setUpdate(table)}
          onDelete={numTable => setDelete(numTable)}
          onAdd={() => setAdd(true)}
        />

        {openAdd && (
          <ModalCreateTable
            open={openAdd}
            onClose={() => setAdd(false)}
            onSave={handleCreateSave}
          />
        )}

        {updatedTable && (
          <ModalUpdateTable
            open={updatedTable !== null}
            table={updatedTable}
            onClose={() => setUpdate(null)}
            onSave={handleUpdateSave}
          />
        )}

        {deletedTable !== null && (
          <ModalDeleteTable
            open={deletedTable !== null}
            numTable={deletedTable}
            loading={loadingDelete}
            onClose={() => setDelete(null)}
            onConfirm={() => handleDeleteSave(deletedTable)}
          />
        )}
      </div>
    </>
  );
}
