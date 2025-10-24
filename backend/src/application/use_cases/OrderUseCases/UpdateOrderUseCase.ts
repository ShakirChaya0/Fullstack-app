import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { ValidationError } from "../../../shared/exceptions/ValidationError.js";
import { PartialOrderMinimal } from "../../../shared/validators/OrderZod.js";


export class UpdateOrderUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository()
    ){}

    public async execute(orderId: number, lineNumbers: number[] | undefined, data: Partial<PartialOrderMinimal>): Promise<Order>{
        console.log('🔍 [UpdateOrderUseCase] Iniciando execute con datos:');
        console.log('   - orderId:', orderId);
        console.log('   - lineNumbers:', lineNumbers);
        console.log('   - data:', JSON.stringify(data, null, 2));

        console.log('📋 [UpdateOrderUseCase] Paso 1: Obteniendo orden...');
        const order = await this.orderRepository.getOne(orderId)
        
        if (!order) {
            console.log('❌ [UpdateOrderUseCase] Orden no encontrada');
            throw new NotFoundError("Pedido no encontradó");
        }
        console.log('✅ [UpdateOrderUseCase] Orden encontrada, estado:', order.status);

        console.log('🔍 [UpdateOrderUseCase] Paso 2: Verificando líneas en preparación...');
        const isInProcess =  order.orderLines.some(line => {
            console.log('   - Verificando línea:', line.lineNumber, 'estado:', line.status);
            return line.status == "En_Preparacion";
        });
        console.log('   - ¿Hay líneas en preparación?', isInProcess);

        console.log('🔍 [UpdateOrderUseCase] Paso 3: Validando items vs preparación...');
        console.log('   - isInProcess:', isInProcess, ', data.items:', !!data.items);
        if(isInProcess && data.items) {
            console.log('❌ [UpdateOrderUseCase] Error: Líneas en preparación y items presente');
            throw new BusinessError(`No se puede modificar el pedido, debido a que se intento modificar líneas de pedido que ya estan en preparación`)
        }
 
        console.log('🔍 [UpdateOrderUseCase] Paso 4: Validando observación...');
        console.log('   - order.status:', order.status, ', data.observacion:', !!data.observacion);
        if (order.status != "Solicitado" && data.observacion) {
            console.log('❌ [UpdateOrderUseCase] Error: No se puede modificar observación');
            throw new BusinessError(`No se puede modificar la observación. El pedido ya se encuentra en preparación`)
        }

        console.log('🔍 [UpdateOrderUseCase] Paso 5: Validando comensales...');
        console.log('   - data.cantidadCubiertos:', data.cantidadCubiertos);
        if (order.status != "En_Preparacion" && order.status != "Solicitado" && order.status != "Completado" && data.cantidadCubiertos) {
            console.log('❌ [UpdateOrderUseCase] Error: No se puede modificar comensales');
            throw new BusinessError(`No se puede modificar la cantidad de comensales. El pedido se encuentra pagado o por pagar`)
        }

        console.log('🔍 [UpdateOrderUseCase] Paso 6: Validando data.items...');
        console.log('   - data.items:', data.items);
        console.log('   - lineNumbers:', lineNumbers);
        if (data.items && lineNumbers) {
            console.log('   - Validando longitudes...');
            if (lineNumbers.length !== data.items.length) {
                console.log('❌ [UpdateOrderUseCase] Error: Longitudes no coinciden');
                throw new ValidationError("La cantidad de números de líneas y de items debe ser la misma");
            }
            
            console.log('   - Validando cada item...');
            data.items.forEach((item, index) => {
                console.log(`     - Item ${index}:`, item);
                if (!item || item.cantidad === undefined) {
                    console.log(`❌ [UpdateOrderUseCase] Error: Item ${index} inválido`);
                    throw new ValidationError(`Item en posición ${index} no tiene cantidad válida`);
                }
            });
        }

        console.log('🔍 [UpdateOrderUseCase] Paso 7: Validando existencia de líneas...');
        if (lineNumbers) {
            lineNumbers.forEach(number => {
                console.log(`   - Verificando línea ${number}...`);
                const exists = order.orderLines.find(ol => ol.lineNumber == number);
                console.log(`   - ¿Existe?`, !!exists);
                if (!exists) {
                    console.log(`❌ [UpdateOrderUseCase] Error: Línea ${number} no existe`);
                    throw new NotFoundError("La linea de pedido que quiere modificar no existe");
                }
            });
        }

        console.log('🚀 [UpdateOrderUseCase] Paso 8: Llamando al repository...');
        console.log('📤 Datos que se envían al repository:');
        console.log('   - orderId:', orderId, '(tipo:', typeof orderId, ')');
        console.log('   - lineNumbers:', lineNumbers, '(tipo:', typeof lineNumbers, ')');
        console.log('   - data:', JSON.stringify(data, null, 2), '(tipo:', typeof data, ')');
        console.log('   - data.items tipo:', typeof data.items, ', valor:', data.items);
        console.log('   - data.cantidadCubiertos tipo:', typeof data.cantidadCubiertos, ', valor:', data.cantidadCubiertos);
        console.log('   - data.observacion tipo:', typeof data.observacion, ', valor:', data.observacion);
        console.log('Antes del modifyRepository')

        try {
            const updatedOrder = await this.orderRepository.modifyOrder(orderId, lineNumbers, data);
            console.log('✅ [UpdateOrderUseCase] Repository exitoso');
            return updatedOrder;
        } catch (error: any) {
            console.log('❌ [UpdateOrderUseCase] Error en repository:', error.message);
            console.log('❌ Stack trace:', error.stack);
            throw error;
        }
    }
}