import { UUID } from "crypto";
import { stateClient } from "../../shared/types/SharedTypes.js";

export interface IClientStateRepository {
    create(idCliente: UUID, clientState: stateClient ): Promise<void>
}