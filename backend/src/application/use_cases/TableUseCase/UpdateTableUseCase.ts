import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { TableState } from "../../../shared/types/SharedTypes.js";

export class UpdateTableUseCase {
    constructor(
        private readonly tableRepository = new TableRepository()
    ) {}

    public async execute(numTable: number, statusTable: TableState): Promise<Table> {
        const table = await this.tableRepository.getByNumTable(numTable); 
        if(!table) throw new NotFoundError('La mesa no se encontró');

        if (table.orders && table.orders.length > 0) {
            // Verificamos si alguno NO está pendiente
            const pedidoActivo = table.orders.find(p => p.estado === "Pagado");
            if (!pedidoActivo && statusTable === "Libre") {
                throw new BusinessError(
                    `La mesa ${numTable} no puede liberarse porque tiene un pedido en estado "${pedidoActivo.estado}".`
                );
            }
        }

        // Si pasa la validación, actualizamos
        const updated = await this.tableRepository.updateTable(numTable, statusTable);
        if (!updated) throw new NotFoundError("No se pudó actualizar la mesa");
        
        return updated;
    }
} 
