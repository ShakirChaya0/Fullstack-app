import { useEffect, useState } from "react";
import type { ITable } from "../interfaces/ITable";
import { fetchTable } from "../services/fetchTable";

export function useTables() {
  const [tables, setTables] = useState<ITable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoading(true);
        const { Tables } = await fetchTable();
        setTables(Tables);
      } catch (err) {
        setError("Error cargando las mesas");
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  return { tables, loading, error };
}
