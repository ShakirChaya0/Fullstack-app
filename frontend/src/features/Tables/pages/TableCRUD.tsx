import { useState, useEffect } from "react";
import { TableList } from "../components/MesasTable";
import { ModalCreateTable } from "../components/ModalCreateTable";
import { ModalDeleteTable } from "../components/ModalDeleteTable";
import { ModalUpdateTable } from "../components/ModalUpdateTable";
import type { ITable } from "../interfaces/ITable";
import { useTables } from "../hooks/useTable";
import { useTableMutation } from "../hooks/useTableMutation";
import { Loader2, AlertCircle } from "lucide-react";
import { useTheme, useMediaQuery, Box } from "@mui/material";

export default function TableCRUD() {
  const { data: tables, isLoading, error } = useTables(); 
  const { mutateAsync } = useTableMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [localTables, setLocalTables] = useState<ITable[]>([]);
  const [openAdd, setAdd] = useState<boolean>(false);
  const [updatedTable, setUpdate] = useState<ITable | null>(null);
  const [deletedTable, setDelete] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  useEffect(() => {
    setLocalTables(tables ?? []);
  }, [tables]);

  const handleCreateSave = async (data: { capacity: number }) => {
    try {
      const newTable = await mutateAsync({ action: "create", _capacity: data.capacity });
      if (newTable) setLocalTables(prev => [...prev, newTable]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSave = async (tableNum: number, data: { capacity?: number; state?: 'Libre' | 'Ocupada' }) => {
    try {
      const updated = await mutateAsync({ action: "updateCapacity", _tableNum: tableNum, _capacity: data.capacity, _state: data.state});
      if (updated) setLocalTables(prev => prev.map(t => t._tableNum === tableNum ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

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

  if (isLoading) {
    return (
      <Box className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <Box className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <Box className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Cargando mesas</h2>
            <p className="text-sm text-gray-500 mt-1">Esto solo tomará un momento...</p>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-4">
        <Box className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full border-l-4 border-red-500">
          <Box className="flex items-center space-x-3 mb-4">
            <Box className="bg-red-100 rounded-full p-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </Box>
            <h2 className="text-xl font-bold text-gray-800">Error al cargar</h2>
          </Box>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las mesas. Por favor, verifica tu conexión e intenta nuevamente.
          </p>
          <Box className="bg-gray-50 rounded-md p-3 mb-4 overflow-x-auto">
            <p className="text-sm text-gray-500 font-mono">{error.message}</p>
          </Box>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Reintentar
          </button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={`flex flex-col items-center w-full min-h-screen px-2 sm:px-6 md:px-12 py-6`}>
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
    </Box>
  );
}
