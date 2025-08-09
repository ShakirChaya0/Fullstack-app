// import { SchemaClientState } from "../../shared/validators/clienteStateZod.js";
import { stateClient } from "../entities/ClientState.js";
import { UUID } from "crypto";

export interface IClientStateRepository {
    create(idCliente: UUID, clientState:stateClient ): Promise<void>
}