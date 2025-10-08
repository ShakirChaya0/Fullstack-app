import type { statusTable } from "../types/TableTypes";

interface StatusProps {
      status: statusTable;
}

export function StatusBadge( {status}: StatusProps ) {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full text-white';
  const statusClasses = {
    Libre: 'bg-teal-600', // --secondary-300
    Ocupada: 'bg-orange-500', // --primary-100
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status}
    </span>
  );
};