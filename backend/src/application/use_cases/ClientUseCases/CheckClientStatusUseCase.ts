import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { ClientStateRepository } from "../../../infrastructure/database/repository/ClientStateRepository.js";
import { PolicyRepository } from "../../../infrastructure/database/repository/PolicyRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class CheckClientStatusUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository(),
        private readonly clientStateRepository = new ClientStateRepository(),
        private readonly policyRepository = new PolicyRepository()
    ) {}

    public async execute(userId: string): Promise<void> {
        const client = await this.clientRepository.getClientByidUser(userId);
        if (!client) throw new NotFoundError("Cliente no encontrado");

        const actualState = client.getActualState();
        if (actualState.state === "Habilitado") return;

        const policy = await this.policyRepository.getPolicy();
        if (this.getDaysDiff(actualState.modifyDate) <= policy.cantDiasDeshabilitacion) return;

        await this.clientStateRepository.create(client.userId, "Habilitado");
    }

    private getDaysDiff(date: Date): number {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const dateString = new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        
        const todayMs = new Date(todayString).getTime();
        const dateMs = new Date(dateString).getTime();
        
        return Math.floor((todayMs - dateMs) / (1000 * 60 * 60 * 24));
    }
}