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

      const messages = {
        create: "Mesa creada exitosamente",
        updateCapacity: "Capacidad actualizada correctamente",
        updateState: "Estado de mesa actualizado",
        delete: "Mesa eliminada",
      };

      const types = {
        create: toast.success,
        updateCapacity: toast.info,
        updateState: toast.info,
        delete: toast.warn,
      };

      types[variables.action](messages[variables.action]);
    },

    onError: (error) => {
      toast.error("Error en la operación de mesa");
      console.error(error);
    },
  });
}
