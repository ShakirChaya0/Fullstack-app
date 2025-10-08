import { useState } from "react";
import type { ITable } from "../interfaces/ITable";
import { StatusBadge } from "./StatusCard";

interface TableCardProps {
  table: ITable;
  onOccupy: (tableNum: number) => Promise<void>; // ahora es async
}

export function TableCard({ table, onOccupy }: TableCardProps) {
  const [localState, setLocalState] = useState(table._state);
  const [loading, setLoading] = useState(false);

  const handleOccupy = async () => {
    setLoading(true);
    try {
      await onOccupy(table._tableNum); // llama a tu mutateAsync
      setLocalState("Ocupada"); // actualiza el estado local instantáneamente
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transition-all duration-300
      ${localState === 'Ocupada' ? 'opacity-60 bg-gray-50' : 'hover:shadow-xl hover:ring-2 hover:ring-orange-200'}
    `}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Mesa {table._tableNum}</h3>
          <StatusBadge status={localState} />
        </div>
        <p className="text-gray-600 mb-4">Capacidad: {table._capacity} comensales</p>
      </div>
      {localState === 'Libre' && (
        <button
          onClick={handleOccupy}
          disabled={loading}
          className="cursor-pointer w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Ocupando..." : "Ocupar Mesa"}
        </button>
      )}
    </div>
  );
}
