import { GetWaiterByUserName } from "../../application/useCases/Waiter/GetWaiterByUserName.js";
import { CUU22ModifyWaiter } from "../../application/useCases/Waiter/CUU22_modifyWaiter.js";
import { CUU24DeleteWaiter } from "../../application/useCases/Waiter/CUU24_deleteWaiter.js";
import {GetWaiterById} from "../../application/useCases/Waiter/GetWaiterByIdUseCase.js";
import { GetWaiter } from "../../application/use_cases/WaiterUseCases/GetWaitersUseCase.js";
import { SchemaWaiter } from "../../shared/validators/waiterZod.js";
import { IWaiterRepository } from "../../domain/repositories/IWaiterRepository.js";
import { Waiter } from "../../domain/entities/Waiter.js";


export class WaiterControllers {
    constructor(
        private readonly getWaiterByUserNameUseCase = new GetWaiterByUserName(),
        private readonly modifyWaiterUseCase = new CUU22ModifyWaiter(),
        private readonly deleteWaiterUseCase = new CUU24DeleteWaiter()
    ) {}

    public async getWaiterByUserName(userName: string) {
        return await this.getWaiterByUserNameUseCase.execute(userName);
    }

    public async modifyWaiter(id: number, data: SchemaWaiter) {
        return await this.modifyWaiterUseCase.execute(id, data);
    }

    public async deleteWaiter(id: number) {
        return await this.deleteWaiterUseCase.execute(id);
    }
}