import type { ConsolidatedOrderLine } from "../interfaces/Order";

export const getConsolidatedLinesToModify = (
    consolidatedOrderLines: ConsolidatedOrderLine[],
) => {
    return consolidatedOrderLines.filter(
        (line) => line.estado === "Pendiente" || line.estado === "Terminada",
    );
};
