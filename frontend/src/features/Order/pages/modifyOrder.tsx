import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useAppSelector } from "../../../shared/hooks/store";
import { OrderTotalAmount } from "../../Products/utils/OrderTotalAmount";
import { useNavigate } from "react-router";
import { PaymentConfirmationModal } from "../components/GoToPaymentConfirmationModal";
import { useWebSocket } from "../../../shared/hooks/useWebSocket";
import { useEffect, useRef } from "react";
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import type { LineaPedido, OrderClientInfo, OrderStatus, Pedido } from "../../Order/interfaces/Order";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import EmptyOrder from "../../Products/assets/empty-order.svg"
import type { FoodType } from "../../Product&Price/types/product&PriceTypes";
import { consolidateOrderLines } from "../utils/consolidateOrderLines";
import { getLinesToDelete } from "../utils/getLinesToDelete";
import { rebuildOrderWithConsolidatedLines } from "../utils/rebuildOrderWithConsolidatedLines";
import { getConsolidatedLinesToModify } from "../utils/getConsolidatedLinesToModify";

export default function ModifyOrder() {
    const navigate = useNavigate();
    const order = useAppSelector((state) => state.order);
    const {
        handleAddToCart,
        hanldeRemoveFromCart,
        handleConfirmOrder,
        handleModifyOrderStatus,
        handleRecoveryCurrentState
    } = useOrderActions();
    const { onEvent, offEvent, sendEvent } = useWebSocket();
    
    useEffect(() => {
        const handleOrderUpdate = (data: OrderClientInfo) => {
            console.log('📨 Actualización recibida en modifyOrder:', data);
            handleModifyOrderStatus({
                newOrderStatus: data.estado, 
                orderLinesData: data.lineasPedido
            });
        };

        const handleOrderUpdateByKitchen = (data: OrderClientInfo) => {
            console.log('📨 Data recibida:', data);
            console.log('📨 lineasPedido:', data.lineasPedido); // Ver estructura exacta
            
            const previousOrder: Pedido = JSON.parse(localStorage.getItem('previousOrder')!);
            const consolidatedOrderLines = consolidateOrderLines(data.lineasPedido);
            
            console.log('📊 Consolidadas:', consolidatedOrderLines); // Ver qué se consolida
            
            // Verificar estados antes de reconstruir
            consolidatedOrderLines.forEach(line => {
                console.log(`Línea ${line.nroLinea}: ${line.nombreProducto} - Estado: "${line.estado}" - Cantidad: ${line.cantidad}`);
            });
            
            const updatedPreviousOrder = rebuildOrderWithConsolidatedLines(
                previousOrder,
                consolidatedOrderLines
            );
            
            console.log('📋 updatedPreviousOrder.lineasPedido:', updatedPreviousOrder.lineasPedido); // Ver líneas finales
            
                    
            updatedPreviousOrder.idPedido = data.idPedido;
            updatedPreviousOrder.estado = data.estado;
            updatedPreviousOrder.observaciones = data.observaciones;

            // Emits: solo Pendiente y Completada
            const lineasAModificar = getConsolidatedLinesToModify(consolidatedOrderLines);
            if (lineasAModificar.length > 0) {
                sendEvent("modifyOrder", {
                    orderId: order.idPedido,
                    lineNumbers: lineasAModificar.map(lp => lp.nroLinea),
                    data: {
                        items: lineasAModificar.map(lp => ({ cantidad: lp.cantidad }))
                    }
                });
            }

            // Líneas duplicadas a eliminar de la BD
            const lineasAEliminar = getLinesToDelete(data.lineasPedido, consolidatedOrderLines);
            lineasAEliminar.forEach(nroLinea => {
                sendEvent("deleteOrderLine", {
                    orderId: order.idPedido,
                    lineNumber: nroLinea
                });
            });

            handleRecoveryCurrentState({ updatedPreviousOrder });
            toast.warning('La cocina ha actualizado su pedido, no se aplicó su modificación');
            
            localStorage.removeItem('previousOrder');
            localStorage.removeItem('modification');
            navigate(`/Cliente/Menu/PedidoConfirmado/`);
        };
  
        // Mismos eventos que FinishedOrder
        onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
        onEvent("addedOrderLine", handleOrderUpdate);
        onEvent("deletedOrderLine", handleOrderUpdate);
        onEvent("modifiedOrderLine", handleOrderUpdate);

        return () => {
            offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
            offEvent("addedOrderLine", handleOrderUpdate);
            offEvent("deletedOrderLine", handleOrderUpdate);
            offEvent("modifiedOrderLine", handleOrderUpdate);
        };
    }, []);

    const comensalesRef = useRef<HTMLInputElement>(null);
    const observacionesRef = useRef<HTMLTextAreaElement>(null);

    const handleAdd = (lp: LineaPedido) => {
        handleAddToCart(lp.producto);
    };

    const handleRemove = (name: string) => {
        hanldeRemoveFromCart({ nombreProducto: name });
    };

    const handleAddProduct = () => {
        localStorage.setItem('modification', 'true')
        navigate('/Cliente/Menu/')
    }

    const handleConfirmModification = () => {
        const newOrderData = {
            ...order,
            comensales: parseInt(comensalesRef.current?.value || '0'),
            observaciones: observacionesRef.current?.value || ''
        };
        
        //   Validar los datos propuestos
        if(newOrderData.comensales <= 0) {
            toast.error('Cantidad de comensales invalida');
            return; // No actualizar nada
        }
        if(newOrderData.observaciones.length > 500) {
            toast.error('Máximo 500 caracteres');
            return; // No actualizar nada
        }
        if(newOrderData.lineasPedido.length === 0) {
            toast.error('No se puede registrar un pedido vacío');
            return; // No actualizar nada
        }
        
        // Solo actualizar si TODO es válido
        handleConfirmOrder({
            comensales: newOrderData.comensales,
            observaciones: newOrderData.observaciones,
        });

        // Validaciones para ejecutar endpoints de WebSocket

        // Obtenemos el pedido antes de la modificación
        const previousOrder: Pedido = JSON.parse(localStorage.getItem('previousOrder')!);

        // Evaluamos nuevas lineas
        // Obtener solo las líneas pendientes del pedido actual
        const lineasPendientesActuales = newOrderData.lineasPedido.filter(lp => lp.estado === 'Pendiente')

        // Filtrar las que NO existían en el pedido previo
        const productosNuevos = lineasPendientesActuales.filter(lp => 
            !previousOrder.lineasPedido.some(existingLp => 
                existingLp.producto._name === lp.producto._name && 
                existingLp.estado === 'Pendiente'
            )
        );

        // Evaluamos lineas eliminadas
        const lineasEliminar = previousOrder.lineasPedido.filter(lp => lp.estado === 'Pendiente')
        console.log('Lineas a eliminar')
        console.log(lineasEliminar)
        const productosEliminados = lineasEliminar.filter(lp => 
            !newOrderData.lineasPedido.some(newLp => 
                newLp.producto._name === lp.producto._name && 
                newLp.estado === 'Pendiente'
            )
        );

        console.log()
        console.log(productosEliminados)

        // Evaluamos lineas modificadas
        const productosModificados = newOrderData.lineasPedido.filter(lp => {
            // Solo considerar líneas que siguen existiendo en ambos pedidos
            const original = previousOrder.lineasPedido.find(oldLp => 
                oldLp.producto._name === lp.producto._name
            );
            
            // Debe existir en ambos Y tener cantidad diferente
            // Además, solo considerar líneas que mantengan un estado modificable
            return original && 
                original.cantidad !== lp.cantidad &&
                original.estado === 'Pendiente' &&  // Solo las que estaban pendientes
                lp.estado === 'Pendiente';          // Y siguen pendientes
        });

        // Validando 0 cambios
        if(
            productosNuevos.length === 0 && 
            productosEliminados.length === 0 && 
            productosModificados.length === 0 &&
            newOrderData.comensales === previousOrder.comensales &&
            newOrderData.observaciones === previousOrder.observaciones
        ) {
            toast.warning('No se detectaron cambios, mantenemos su pedido original')
            localStorage.removeItem('previousOrder')
            localStorage.removeItem('modification')
            navigate(`/Cliente/Menu/PedidoConfirmado/`)
            return
        }

        // 🔍 DEBUG: Información de cambios detectados
        console.log('=== ANÁLISIS DE MODIFICACIONES ===');
        console.log('📊 Productos nuevos:', productosNuevos.length, productosNuevos);
        console.log('🗑️ Productos eliminados:', productosEliminados.length, productosEliminados);
        console.log('✏️ Productos modificados:', productosModificados.length, productosModificados);
        console.log('👥 Comensales cambiados:', newOrderData.comensales !== previousOrder.comensales);
        console.log('📝 Observaciones cambiadas:', newOrderData.observaciones !== previousOrder.observaciones);
        console.log('🔄 Estado actual del pedido:', newOrderData.estado);

        //   LÓGICA CORREGIDA: Solo cambiar estado si hay cambios en productos
        const calcularEstadoFinalPedido = (): OrderStatus=> {
            console.log('🧮 Calculando estado final del pedido...');
            
            // Solo calcular nuevo estado si hay cambios en productos
            const hayCambiosEnProductos = productosNuevos.length > 0 || productosEliminados.length > 0 || productosModificados.length > 0;
            
            if (!hayCambiosEnProductos) {
                console.log('🔒 Sin cambios en productos - manteniendo estado:', newOrderData.estado);
                return newOrderData.estado; // Mantener estado actual
            }
            
            // Simular el estado final después de todas las modificaciones
            let lineasFinales = [...newOrderData.lineasPedido];
            console.log('📋 Líneas iniciales:', lineasFinales.length);
            
            // Simular eliminación de productos 
            productosEliminados.forEach(producto => {
                lineasFinales = lineasFinales.filter(lp => 
                    !(lp.producto._name === producto.producto._name && lp.estado === 'Pendiente')
                );
                console.log(`➖ Eliminado ${producto.producto._name}, líneas restantes:`, lineasFinales.length);
            });
            
            // Contar líneas pendientes finales
            const lineasPendientesFinales = lineasFinales.filter(lp => lp.estado === 'Pendiente').length;
            console.log('⏳ Líneas pendientes finales:', lineasPendientesFinales);
            
            // Determinar estado final basado en productos
            let nuevoEstado: OrderStatus = 'Solicitado';
            if (lineasPendientesFinales > 0) {
                // Si hay productos nuevos o modificados, va a preparación
                if (productosNuevos.length > 0) {
                    nuevoEstado = 'En_Preparacion';
                } else {
                    // Si solo hay modificaciones de cantidad, mantener estado o ir a preparación
                    nuevoEstado = newOrderData.estado === 'Solicitado' ? 'En_Preparacion' : newOrderData.estado;
                }
            } else {
                nuevoEstado = 'Completado';
            }
            
            console.log('🎯 Estado calculado:', nuevoEstado);
            return nuevoEstado;
        };
        
        const estadoFinalCalculado = calcularEstadoFinalPedido();
        
        //   OPTIMISTIC UPDATE: Actualizar estado solo si cambia
        if (newOrderData.estado !== estadoFinalCalculado) {
            console.log(`🚀 Actualizando estado optimísticamente: ${newOrderData.estado} → ${estadoFinalCalculado}`);
            handleModifyOrderStatus({
                newOrderStatus: estadoFinalCalculado,
                orderLinesData: newOrderData.lineasPedido.map(lp => ({
                    nombreProducto: lp.producto._name,
                    tipo: lp.tipo as FoodType || null,
                    cantidad: lp.cantidad,
                    estado: lp.estado,
                    nroLinea: lp.lineNumber || 0
                }))
            });
        } else {
            console.log('  Estado no cambia, mantieniendo:', newOrderData.estado);
        }

        if (productosNuevos.length > 0) {
            // Añadir todas las lineas
            sendEvent("addOrderLine", {
                orderId: order.idPedido,
                orderLines: productosNuevos.map( eachLp => {
                    return (
                        {
                            nombre: eachLp.producto._name,
                            tipo: eachLp.tipo,
                            monto: eachLp.producto._price,
                            cantidad: eachLp.cantidad,
                            esAlcoholica: eachLp.esAlcoholica
                        }
                    )
                })
            });
        }

        // Eliminar todas las lineas correspondientes
        productosEliminados.forEach(lineaPedido => {
            sendEvent("deleteOrderLine", {
                orderId: order.idPedido,
                lineNumber: lineaPedido.lineNumber
            });
        });

        // Modificar pedido - comensales y observaciones
        const hayComensalesModificados = newOrderData.comensales !== previousOrder.comensales;
        const hayObservacionesModificadas = newOrderData.observaciones !== previousOrder.observaciones;
        const hayProductosModificados = productosModificados.length > 0;

        if( hayObservacionesModificadas && newOrderData.estado === 'En_Preparacion') {
            toast.warning('No se puede modificar las observaciones de un pedido en preparación.')
            return
        }

        if (hayComensalesModificados || hayObservacionesModificadas || hayProductosModificados) {
            sendEvent("modifyOrder", {
                orderId: order.idPedido,
                lineNumbers: productosModificados.map(lp => lp.lineNumber),
                data: {
                    cantidadCubiertos: hayComensalesModificados ? newOrderData.comensales : undefined,
                    observacion: hayObservacionesModificadas ? newOrderData.observaciones : undefined,
                    items: productosModificados.map(lp => (
                            { cantidad: lp.cantidad }
                        ))
                }
            });
        }

        toast.success('Todos los cambios hechos')

        localStorage.removeItem('previousOrder')
        localStorage.removeItem('modification')
        
        navigate(`/Cliente/Menu/PedidoConfirmado/`)
    }

    const baseButtonStyle = `active:bg-orange-700 hover:scale-105 relative transition-all 
                               ease-linear duration-100 active:scale-95 py-3 px-4 
                               rounded-lg shadow-lg text-white font-bold cursor-pointer`;

    return (
        <section className="p-4 flex flex-col w-full items-center justify-center">
            <div className="md:border flex flex-col justify-between py-4 md:border-gray-300 md:shadow-2xl min-h-[500px] w-full max-w-3xl md:rounded-2xl">

                <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0 mx-5 mb-3 md:items-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Modificar Pedido</h1>
                    <div className="flex gap-1 md:gap-2">
                        <span className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800">Total:</span>
                        <span className="text-sm sm:text-xl md:text-2xl font-bold text-orange-500">{formatCurrency(OrderTotalAmount(order.lineasPedido), 'es-AR', 'ARS')}</span>
                    </div>
                </div>

                {/* Vista Móvil */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {
                        order.lineasPedido?.length === 0 &&
                        <>
                            <img src={EmptyOrder} alt="pedido vacio" className="m-auto w-fit"/>
                            <p className="text-center">Pedido Vacio</p>
                        </>
                    }
                    {order.lineasPedido.map((lp) => (
                        <div
                            key={lp.producto._name}
                            className="flex flex-col gap-2 border #e5e7eb rounded-xl shadow-sm p-3"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col max-w-[200px]">
                                    <span className="font-semibold">{lp.producto._name}</span>
                                    <span className="text-sm text-gray-600 max-h-[60px] overflow-y-auto pr-1">
                                        {lp.producto._description}
                                    </span>
                                    <span className="text-orange-600 font-bold">
                                        {formatCurrency(lp.subtotal, 'es-AR', 'ARS')}
                                    </span>
                                    <span>
                                        <span className="font-medium">{lp.estado.replace('_', ' ').replace('o', 'ó')}</span>
                                    </span>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-bold">Cant: {lp.cantidad}</p>
                                    <p className="text-sm font-bold">Precio: {formatCurrency((lp.producto._price * lp.cantidad), 'es-AR', 'ARS')}</p>
                                </div>
                            </div>

                            <div className="self-end border rounded-md transition-all duration-200 bg-orange-500 text-white font-medium flex flex-row justify-around items-center gap-1 w-fit">
                                { lp.estado === 'Pendiente' && 
                                <button
                                    onClick={() => handleRemove(lp.producto._name)}
                                    className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 
                                    'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'`}
                                >
                                    <RemoveCircleOutlineIcon />
                                </button>
                                }
                                <p className='px-2 py-1'>{lp.cantidad}</p>
                                { lp.estado === 'Pendiente' &&
                                <button
                                    onClick={() => handleAdd(lp)}
                                    className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'`}
                                >
                                    <ControlPointIcon />
                                </button>
                                }
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col gap-3 mt-4">
                        <div className="flex flex-row gap-3 items-center">
                            <label htmlFor="cantComensales">
                                Cantidad de comensales:
                            </label>
                            <input
                                required
                                name="cantidad"
                                type="number"
                                min={1}
                                id="cantComensales"
                                placeholder="ej:1"
                                className="py-0.5 px-1 w-12 outline-0 rounded-lg bg-gray-200"
                                ref={comensalesRef}
                                defaultValue={order.comensales}
                                onInput={(e) => {
                                    if (e.currentTarget.valueAsNumber < 1) e.currentTarget.value = "1";
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="obsMobile">Observaciones: </label>
                            <textarea
                                name="observaciones"
                                className={`rounded-2xl py-2 px-4 outline-0 ${
                                    order.estado === 'En_Preparacion' 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-gray-200'
                                }`}
                                placeholder="ej: sin cebolla en la hamburguesa"
                                rows={4}
                                id="obsMobile"
                                ref={observacionesRef}
                                defaultValue={order.observaciones}
                                disabled={order.estado === 'En_Preparacion'}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                className={`m-auto w-full mt-2 bg-orange-500 ${baseButtonStyle}`}
                                onClick={handleAddProduct}
                            >
                                Agregar Productos
                            </button>
                            <button
                                className={`m-auto w-full bg-green-500 ${baseButtonStyle}`}
                                onClick={handleConfirmModification}
                            >
                                Confirmar Modificación
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vista Desktop */}
                {
                    order.lineasPedido?.length === 0 ?
                        <div className="hidden md:block">
                            <img src={EmptyOrder} alt="pedido vacio" className="m-auto w-fit"/>
                            <p className="text-center">Pedido Vacio</p>
                        </div>
                        :
                        <TableContainer component={Paper} className="hidden md:block w-full">
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#1e2939" }}>
                                        <TableCell sx={{ color: "white" }}>Producto</TableCell>
                                        <TableCell sx={{ color: "white" }}>Descripción</TableCell>
                                        <TableCell align="right" sx={{ color: "white" }}>Cantidad</TableCell>
                                        <TableCell align="right" sx={{ color: "white" }}>Precio</TableCell>
                                        <TableCell align="right" sx={{ color: "white" }}>Subtotal</TableCell>
                                        <TableCell align="center" sx={{ color: "white" }}>Estado</TableCell>
                                        <TableCell align="center" sx={{ color: "white" }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.lineasPedido.map((lp) => (
                                        <TableRow sx={{
                                            backgroundColor: (lp.estado === 'En_Preparacion' || lp.estado === 'Terminada') ? '#e5e7eb' : 'white'
                                            }}
                                            key={lp.producto._name}>
                                            <TableCell>{lp.producto._name}</TableCell>
                                            <TableCell>{lp.producto._description}</TableCell>
                                            <TableCell align="right">{lp.cantidad}</TableCell>
                                            <TableCell align="right">{formatCurrency(lp.producto._price, 'es-AR', 'ARS')}</TableCell>
                                            <TableCell align="right">{formatCurrency(lp.subtotal, 'es-AR', 'ARS')}</TableCell>
                                            <TableCell align="center">{lp.estado.replace('_', ' ').replace('o', 'ó')}</TableCell>
                                            <TableCell align="center">
                                                <div className={`self-center border rounded-md transition-all duration-200 bg-orange-500 text-white font-medium flex flex-row justify-around items-center gap-1 w-fit m-auto`}>
                                                    { lp.estado === 'Pendiente' &&
                                                    <button
                                                        onClick={() => handleRemove(lp.producto._name)}
                                                        className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'
                                                        `}
                                                    >
                                                        <RemoveCircleOutlineIcon />
                                                    </button>
                                                    }
                                                    <p className={`px-2 py-1 ${lp.estado === 'En_Preparacion' || lp.estado === 'Terminada' ? 'bg-gray-200 text-black border-2 border-black' : 'bg-orange-500 text-white'}`}>{lp.cantidad}</p>
                                                    { lp.estado === 'Pendiente' &&
                                                    <button
                                                        onClick={() => handleAdd(lp)}
                                                        className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'
                                                        `}
                                                    >
                                                        <ControlPointIcon />
                                                    </button>
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }

                <div className="hidden md:block p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-3">
                            <label htmlFor="cantComensalesDesktop" className="font-semibold">
                                Cantidad de comensales:
                            </label>
                            <input
                                required
                                name="cantidad"
                                type="number"
                                min={1}
                                id="cantComensalesDesktop"
                                placeholder="ej:1"
                                className="py-0.5 px-1 w-12 outline-0 rounded-lg bg-gray-200"
                                ref={comensalesRef}
                                defaultValue={order.comensales}
                                onInput={(e) => {
                                    if (e.currentTarget.valueAsNumber < 1) e.currentTarget.value = "1";
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="obsDesktop" className="font-semibold">Observaciones: </label>
                            <textarea
                                name="observaciones"
                                className={`rounded-2xl py-2 px-4 outline-0 ${
                                    order.estado === 'En_Preparacion' 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-gray-200'
                                }`}
                                placeholder="ej: sin cebolla en la hamburguesa"
                                rows={4}
                                id="obsDesktop"
                                ref={observacionesRef}
                                defaultValue={order.observaciones}
                                disabled={order.estado === 'En_Preparacion'}
                            />
                        </div>

                        <div className="flex justify-between mt-4 gap-4">
                            <button
                                className={`flex-1 bg-orange-500 ${baseButtonStyle}`}
                                onClick={handleAddProduct}
                            >
                                Agregar Productos
                            </button>
                            <button
                                className={`flex-1 bg-green-500 ${baseButtonStyle}`}
                                onClick={handleConfirmModification}
                            >
                                Confirmar Modificación
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <PaymentConfirmationModal />
        </section>
    )
}