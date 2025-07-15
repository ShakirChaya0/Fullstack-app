import { SchemaClientState } from "../../shared/validators/clienteStateZod.js";
import { ClientState } from "../entities/ClientState.js";
import { UUID } from "crypto";

export interface IClientStateRepository {
    create(clienteState: SchemaClientState, idCliente: UUID ): Promise<ClientState>
}