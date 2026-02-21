import type { OrderLineClientInfo } from "../interfaces/Order";

export const getConsolidatedLinesToModify = (consolidatedOrderLines: OrderLineClientInfo[]) => {
    return consolidatedOrderLines.filter(line =>
        line.estado === 'Pendiente' || line.estado === 'Terminada'
    );
};