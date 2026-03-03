import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { statusTable } from "../types/TableTypes";
import { useApiClient } from "../../../shared/hooks/useApiClient";
import type { ITable } from "../interfaces/ITable";
import { createTable } from "../services/createTable";
import { deleteTable } from "../services/deleteTable";
import { updateTableCapacity } from "../services/updateTableCapacity";
import { updateTableByStatus } from "../services/updateTableByStatus";

interface TablePayload {
  _tableNum?: number;
  _capacity?: number;
  _state?: statusTable;
  action: "create" | "updateCapacity" | "updateState" | "delete";
}

export function useTableMutation() {
  const queryClient = useQueryClient();
  const { apiCall } = useApiClient();

  return useMutation<ITable | void, Error, TablePayload>({
    mutationFn: async ({ action, _tableNum, _capacity, _state }) => {
      switch (action) {
        case "create": {
          if (_capacity == null)
            throw new Error("Faltan datos para crear la mesa");
          return createTable(apiCall, _capacity);
        }

        case "updateCapacity": {
          if (!_tableNum || _capacity == null)
            throw new Error("Faltan datos para actualizar la capacidad");
          return updateTableCapacity(apiCall, { _tableNum, _capacity });
        }

        case "updateState": {
          if (!_tableNum || !_state)
            throw new Error("Faltan datos para actualizar el estado");
          return updateTableByStatus(apiCall, { _tableNum, _state });
        }

        case "delete": {
          if (!_tableNum)
            throw new Error("Falta el número de mesa para eliminar");
          return deleteTable(apiCall, _tableNum);
        }

        default:
          throw new Error("Acción desconocida");
      }
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["tables"] });
      await queryClient.invalidateQueries({ queryKey: ["waitersTable"] });

      if (variables.action === "create") {
        toast.success("Mesa creada exitosamente");
      }
      else if (variables.action === "updateCapacity") {
        toast.info("Capacidad actualizada correctamente");
      }
      else if (variables.action === "delete") {
        toast.info("Mesa eliminada");
      }
    },

    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });
}
