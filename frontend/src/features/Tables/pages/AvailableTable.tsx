import { useState, useEffect } from "react";
import type { ITable } from "../interfaces/ITable";
import { TableCard } from "../components/TableCard";
import { useTables } from "../hooks/useTable";
import { useTableMutation } from "../hooks/useTableMutation";
import { toast } from "react-toastify";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AvailableTable() {
  const { data: tables, isLoading, error } = useTables();
  const { mutateAsync: updateTable } = useTableMutation();

  const [localTables, setLocalTables] = useState<ITable[]>([]);
  const [filteredTables, setFilteredTables] = useState<ITable[]>([]);
  const [capacity, setCapacity] = useState<string>('');
  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(false);

  // Mantener tablas locales sincronizadas con query
  useEffect(() => {
    if (tables) {
      setLocalTables(tables);
    }
  }, [tables]);

  // Filtrado de mesas
  useEffect(() => {
    let result = [...localTables];
    const requestedCapacity = parseInt(capacity, 10);

    if (!isNaN(requestedCapacity) && requestedCapacity > 0) {
      result = result.filter(t => t._capacity >= requestedCapacity);
    }

    if (showOnlyFree) {
      result = result.filter(t => t._state === "Libre");
    }

    setFilteredTables(result);
  }, [capacity, showOnlyFree, localTables]);

  // Función para ocupar mesa
  const handleOccupyTable = async (tableNum: number) => {
    try {
      setLocalTables(prev =>
        prev.map(t =>
          t._tableNum === tableNum ? { ...t, _state: "Ocupada" } : t
        )
      );

      // Llamada al backend
      await updateTable({ action: "updateState", _tableNum: tableNum, _state: "Ocupada" });

      toast.success(`Mesa ${tableNum} ocupada correctamente`);
    } catch (err) {
      toast.error(`Error al ocupar la mesa ${tableNum}`);
      console.error(err);

      // Revertir cambio local si falla
      setLocalTables(prev =>
        prev.map(t =>
          t._tableNum === tableNum ? { ...t, _state: "Libre" } : t
        )
      );
    }
  };

  const handleResetFilters = () => {
    setCapacity('');
    setShowOnlyFree(false);
  };

 if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Cargando mesas</h2>
            <p className="text-sm text-gray-500 mt-1">Esto solo tomará un momento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 rounded-full p-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Error al cargar</h2>
          </div>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las mesas. Por favor, verifica tu conexión e intenta nuevamente.
          </p>
          <div className="bg-gray-50 rounded-md p-3 mb-4">
            <p className="text-sm text-gray-500 font-mono">{error.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 w-full font-sans text-gray-800 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">Gestor de Mesas</h1>
          <p className="text-lg text-teal-700">Consulta y administra la disponibilidad en tiempo real.</p>
        </header>

        {/* Panel de Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-4 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="col-span-1">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Nº de Comensales
              </label>
              <input
                type="number"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Ej: 4"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <div className="flex items-center h-10">
                <input
                  id="showOnlyFree"
                  type="checkbox"
                  checked={showOnlyFree}
                  onChange={(e) => setShowOnlyFree(e.target.checked)}
                  className="cursor-pointer h-5 w-5 rounded bg-gray-100 border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="showOnlyFree" className="ml-3 text-sm font-medium text-gray-800">
                  Mostrar solo mesas libres
                </label>
              </div>
            </div>

            <div className="col-span-1">
              <button
                onClick={handleResetFilters}
                className="cursor-pointer w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors duration-300"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Listado de Mesas */}
        {filteredTables.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTables.slice()
              .sort((a,b) => a._tableNum - b._tableNum )
              .map(table => (
                <TableCard key={table._tableNum} table={table} onOccupy={handleOccupyTable} />
              ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-semibold text-gray-800">No se encontraron mesas</h3>
            <p className="mt-1 text-sm text-gray-600">Prueba a cambiar los filtros o a limpiar la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
