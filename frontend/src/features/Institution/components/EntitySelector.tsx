import type { EntityState } from "../pages/Institution";

export default function EntitySelector({entity, setEntity}: {entity: EntityState; setEntity: (entity: EntityState) => void;}) {
  const baseClasses =  "px-4 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer text-center min-w-[120px]";

  return (
    <div className="flex flex-row gap-4 justify-center items-start mt-2">
      <button
        onClick={() => setEntity("Policy")}
        className={`${baseClasses} ${
          entity === "Policy"
            ? "bg-teal-600 text-white shadow-lg border-2 border-teal-900 scale-105"
            : "bg-gray-200 text-gray-700 hover:bg-teal-500 hover:text-white"
        }`}
      >
        Políticas
      </button>

      <button
        onClick={() => setEntity("Information")}
        className={`${baseClasses} ${
          entity === "Information"
            ? "bg-teal-600 text-white shadow-lg border-2 border-teal-900 scale-105"
            : "bg-gray-200 text-gray-700 hover:bg-teal-500 hover:text-white"
        }`}
      >
        Información
      </button>
    </div>
  );
}
