import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useAppSelector } from "../../../shared/hooks/store";
import { OrderTotalAmount } from "../../Products/utils/OrderTotalAmount";
import { useNavigate } from "react-router";
import { PaymentConfirmationModal } from "../components/GoToPaymentConfirmationModal";
import { useWebSocket } from "../../../shared/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import type {
    LineaPedido,
    OrderClientInfo,
    OrderStatus,
    Pedido,
} from "../../Order/interfaces/Order";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import EmptyOrder from "../../Products/assets/empty-order.svg";
import type { FoodType } from "../../Product&Price/types/product&PriceTypes";
import { consolidateOrderLines } from "../utils/consolidateOrderLines";
import { getLinesToDelete } from "../utils/getLinesToDelete";
import { rebuildOrderWithConsolidatedLines } from "../utils/rebuildOrderWithConsolidatedLines";
import { getConsolidatedLinesToModify } from "../utils/getConsolidatedLinesToModify";
import { splitConsolidatedModification } from "../utils/splitConsolidatedModification";
import { groupLines, getClientLineType, TYPE_ORDER, formatTypeName } from "../utils/groupOrderLinesByType";
import useAuth from "../../../shared/hooks/useAuth";
import { useApiClient } from "../../../shared/hooks/useApiClient";
import { getClient } from "../../Client/Services/getClient";

export default function ModifyOrder() {
    const navigate = useNavigate();
    const order = useAppSelector((state) => state.order);
    const { user, isAuthenticated } = useAuth();
    const { apiCall } = useApiClient();
    const [isAdultClient, setIsAdultClient] = useState<boolean | null>(null);
    const [comensalesInput, setComensalesInput] = useState(
        String(order.comensales ?? ""),
    );
    const [observacionesInput, setObservacionesInput] = useState(
        order.observaciones ?? "",
    );
    const {
        handleAddToCart,
        hanldeRemoveFromCart,
        handleConfirmOrder,
        handleModifyOrderStatus,
        handleRecoveryCurrentState,
    } = useOrderActions();
    const { onEvent, offEvent, sendEvent } = useWebSocket();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setComensalesInput(String(order.comensales ?? ""));
        setObservacionesInput(order.observaciones ?? "");
    }, [order.comensales, order.observaciones]);

    useEffect(() => {
        let isMounted = true;

        const loadClientAge = async () => {
            if (!(isAuthenticated && user?.tipoUsuario === "Cliente")) {
                if (isMounted) setIsAdultClient(true);
                return;
            }

            try {
                const client = await getClient(apiCall, user.idUsuario);
                const birthday = new Date(client.fechaNacimiento);
                const today = new Date();
                const age =
                    today.getFullYear() -
                    birthday.getFullYear() -
                    (today <
                    new Date(
                        today.getFullYear(),
                        birthday.getMonth(),
                        birthday.getDate(),
                    )
                        ? 1
                        : 0);

                if (isMounted) setIsAdultClient(age >= 18);
            } catch {
                if (isMounted) setIsAdultClient(null);
            }
        };

        loadClientAge();

        return () => {
            isMounted = false;
        };
    }, [apiCall, isAuthenticated, user?.idUsuario, user?.tipoUsuario]);

    const isAlcoholicOrderLine = (line: LineaPedido): boolean => {
        return (
            line.esAlcoholica === true ||
            ("_isAlcoholic" in line.producto &&
                line.producto._isAlcoholic === true)
        );
    };

    const isLoggedClient =
        isAuthenticated && user?.tipoUsuario === "Cliente";

    const hasPendingAgeValidation =
        isLoggedClient && isAdultClient === null;

    const isMinorLoggedClient =
        isLoggedClient &&
        isAdultClient === false;

    useEffect(() => {
        const handleOrderUpdateByKitchen = (data: OrderClientInfo) => {
            const previousOrder: Pedido = JSON.parse(
                localStorage.getItem("previousOrder")!,
            );
            const consolidatedOrderLines = consolidateOrderLines(
                data.lineasPedido,
            );

            const updatedPreviousOrder = rebuildOrderWithConsolidatedLines(
                previousOrder,
                consolidatedOrderLines,
            );

            updatedPreviousOrder.idPedido = data.idPedido;
            updatedPreviousOrder.estado = data.estado;
            updatedPreviousOrder.observaciones = data.observaciones;

            // Emits: solo Pendiente y Completada
            const lineasAModificar = getConsolidatedLinesToModify(
                consolidatedOrderLines,
            );
            if (lineasAModificar.length > 0) {
                sendEvent("modifyOrder", {
                    orderId: order.idPedido,
                    lineNumbers: lineasAModificar.map((lp) => lp.nroLinea),
                    data: {
                        items: lineasAModificar.map((lp) => ({
                            cantidad: lp.cantidad,
                        })),
                    },
                });
            }

            // Líneas duplicadas a eliminar de la BD
            const lineasAEliminar = getLinesToDelete(
                data.lineasPedido,
                consolidatedOrderLines,
            );
            lineasAEliminar.forEach((nroLinea) => {
                sendEvent("deleteOrderLine", {
                    orderId: order.idPedido,
                    lineNumber: nroLinea,
                });
            });

            handleRecoveryCurrentState({ updatedPreviousOrder });
            toast.info(
                "La cocina ha actualizado su pedido, no se aplicó su modificación",
            );

            localStorage.removeItem("previousOrder");
            localStorage.removeItem("modification");
            navigate(`/Cliente/Menu/PedidoConfirmado/`);
        };

        // Mismos eventos que FinishedOrder
        onEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
        // onEvent("addedOrderLine", handleOrderUpdate);
        // onEvent("deletedOrderLine", handleOrderUpdate);
        // onEvent("modifiedOrderLine", handleOrderUpdate);

        return () => {
            offEvent("updatedOrderLineStatus", handleOrderUpdateByKitchen);
            // offEvent("addedOrderLine", handleOrderUpdate);
            // offEvent("deletedOrderLine", handleOrderUpdate);
            // offEvent("modifiedOrderLine", handleOrderUpdate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleComensalesChange = (value: string) => {
        if (value === "") {
            setComensalesInput("");
            return;
        }

        const parsedValue = Number(value);

        if (Number.isNaN(parsedValue)) {
            return;
        }

        if (parsedValue < 1) {
            setComensalesInput("1");
            return;
        }

        if (parsedValue > 50) {
            setComensalesInput("50");
            return;
        }

        setComensalesInput(value);
    };

    const handleAdd = (lp: LineaPedido) => {
        if (hasPendingAgeValidation && isAlcoholicOrderLine(lp)) {
            toast.warning(
                "No se pudo validar su edad. Intente nuevamente en unos segundos.",
            );
            return;
        }

        if (isMinorLoggedClient && isAlcoholicOrderLine(lp)) {
            toast.warning(
                "El cliente debe ser mayor de 18 años para pedir una bebida alcohólica",
            );
            return;
        }

        handleAddToCart(lp.producto);
    };

    const handleRemove = (name: string) => {
        hanldeRemoveFromCart({ nombreProducto: name });
    };

    const handleAddProduct = () => {
        localStorage.setItem("modification", "true");
        navigate("/Cliente/Menu/");
    };

    const handleConfirmModification = () => {
        const parsedComensales = Number(comensalesInput);

        const newOrderData = {
            ...order,
            comensales: Number.isNaN(parsedComensales) ? 0 : parsedComensales,
            observaciones: observacionesInput,
        };

        //   Validar los datos propuestos
        if (newOrderData.comensales <= 0 || newOrderData.comensales > 50) {
            toast.error("Cantidad de comensales invalida");
            return; // No actualizar nada
        }
        if (newOrderData.observaciones.length > 500) {
            toast.error("Máximo 500 caracteres");
            return; // No actualizar nada
        }
        if (newOrderData.lineasPedido.length === 0) {
            toast.error("No se puede registrar un pedido vacío");
            return; // No actualizar nada
        }
        if (
            hasPendingAgeValidation &&
            newOrderData.lineasPedido.some(isAlcoholicOrderLine)
        ) {
            toast.warning(
                "No se pudo validar su edad. Intente nuevamente en unos segundos.",
            );
            return;
        }
        if (
            isMinorLoggedClient &&
            newOrderData.lineasPedido.some(isAlcoholicOrderLine)
        ) {
            toast.error(
                "El cliente debe ser mayor de 18 años para pedir una bebida alcohólica",
            );
            return;
        }

        // Solo actualizar si TODO es válido
        handleConfirmOrder({
            comensales: newOrderData.comensales,
            observaciones: newOrderData.observaciones,
        });

        // Validaciones para ejecutar endpoints de WebSocket

        // Obtenemos el pedido antes de la modificación
        const previousOrder: Pedido = JSON.parse(
            localStorage.getItem("previousOrder")!,
        );

        // Evaluamos nuevas lineas
        // Obtener solo las líneas pendientes del pedido actual
        const lineasPendientesActuales = newOrderData.lineasPedido.filter(
            (lp) => lp.estado === "Pendiente",
        );

        // Filtrar las que NO existían en el pedido previo
        const productosNuevos = lineasPendientesActuales.filter(
            (lp) =>
                !previousOrder.lineasPedido.some(
                    (existingLp) =>
                        existingLp.producto._name === lp.producto._name &&
                        existingLp.estado === "Pendiente",
                ),
        );

        // Evaluamos lineas eliminadas
        const lineasEliminar = previousOrder.lineasPedido.filter(
            (lp) => lp.estado === "Pendiente",
        );

        const productosEliminados = lineasEliminar.filter(
            (lp) =>
                !newOrderData.lineasPedido.some(
                    (newLp) =>
                        newLp.producto._name === lp.producto._name &&
                        newLp.estado === "Pendiente",
                ),
        );

        // Evaluamos lineas modificadas
        const productosModificados = newOrderData.lineasPedido.filter((lp) => {
            // Buscar línea previa que tenga MISMO NOMBRE Y MISMO ESTADO
            const original = previousOrder.lineasPedido.find(
                (oldLp) =>
                    oldLp.producto._name === lp.producto._name &&
                    oldLp.estado === lp.estado, // ✅ Buscar por nombre Y estado
            );

            // Debe existir en ambos Y tener cantidad diferente
            // Además, solo considerar líneas que mantengan un estado modificable (Pendiente)
            return (
                original &&
                original.cantidad !== lp.cantidad &&
                lp.estado === "Pendiente" // Solo modificar líneas pendientes
            );
        });

        // Validando 0 cambios
        if (
            productosNuevos.length === 0 &&
            productosEliminados.length === 0 &&
            productosModificados.length === 0 &&
            newOrderData.comensales === previousOrder.comensales &&
            newOrderData.observaciones === previousOrder.observaciones
        ) {
            localStorage.removeItem("previousOrder");
            localStorage.removeItem("modification");
            navigate(`/Cliente/Menu/PedidoConfirmado/`);
            return;
        }

        //   LÓGICA CORREGIDA: Solo cambiar estado si hay cambios en productos
        const calcularEstadoFinalPedido = (): OrderStatus => {

            // Solo calcular nuevo estado si hay cambios en productos
            const hayCambiosEnProductos =
                productosNuevos.length > 0 ||
                productosEliminados.length > 0 ||
                productosModificados.length > 0;

            if (!hayCambiosEnProductos) {
                return newOrderData.estado;
            }

            // Simular el estado final después de todas las modificaciones
            let lineasFinales = [...newOrderData.lineasPedido];

            // Eliminar productos (sin importar su estado)
            productosEliminados.forEach((producto) => {
                lineasFinales = lineasFinales.filter(
                    (lp) => lp.producto._name !== producto.producto._name,
                );
            });

            // Validar que no queden líneas vacías
            if (lineasFinales.length === 0) {
                return "Solicitado"; // O manejar como error
            }

            // Analizar estados de las líneas finales
            const estadosPresentes = {
                pendiente: lineasFinales.some(
                    (lp) => lp.estado === "Pendiente",
                ),
                enPreparacion: lineasFinales.some(
                    (lp) => lp.estado === "En_Preparacion",
                ),
                terminada: lineasFinales.some(
                    (lp) => lp.estado === "Terminada",
                ),
            };

            // Prioridad: En_Preparacion > Terminada > Pendiente
            let nuevoEstado: OrderStatus;

            if (estadosPresentes.enPreparacion) {
                // Si hay AL MENOS UNA línea en preparación
                nuevoEstado = "En_Preparacion";
            } else if (
                estadosPresentes.terminada &&
                !estadosPresentes.pendiente
            ) {
                // Si TODAS están terminadas
                nuevoEstado = "Completado";
            } else if (
                estadosPresentes.pendiente &&
                !estadosPresentes.terminada
            ) {
                // Si TODAS están pendientes
                nuevoEstado = "Solicitado";
            } else {
                // Estado mixto (pendiente + terminada, sin preparación)
                // Depende de tu lógica, pero generalmente sería En_Preparacion o Solicitado
                nuevoEstado = "En_Preparacion";
            }

            return nuevoEstado;
        };

        const estadoFinalCalculado = calcularEstadoFinalPedido();

        // OPTIMISTIC UPDATE: Actualizar estado solo si cambia
        if (newOrderData.estado !== estadoFinalCalculado) {
            handleModifyOrderStatus({
                newOrderStatus: estadoFinalCalculado,
                orderLinesData: newOrderData.lineasPedido.map((lp) => ({
                    nombreProducto: lp.producto._name,
                    tipo: (lp.tipo as FoodType) || null,
                    cantidad: lp.cantidad,
                    estado: lp.estado,
                    nroLinea: lp.lineNumbers?.[0] || 0,
                })),
            });
        }

        if (productosNuevos.length > 0) {
            // Añadir todas las lineas
            sendEvent("addOrderLine", {
                orderId: order.idPedido,
                orderLines: productosNuevos.map((eachLp) => {
                    return {
                        nombre: eachLp.producto._name,
                        tipo: eachLp.tipo,
                        monto: eachLp.producto._price,
                        cantidad: eachLp.cantidad,
                        esAlcoholica: eachLp.esAlcoholica,
                    };
                }),
            });
        }

        // Eliminamos todas las lineas correspondientes
        productosEliminados.forEach((lineaPedido) => {
            // Eliminamos TODOS los lineNumbers de la línea consolidada
            lineaPedido.lineNumbers?.forEach((lineNum) => {
                sendEvent("deleteOrderLine", {
                    orderId: order.idPedido,
                    lineNumber: lineNum,
                });
            });
        });

        // Modificar pedido - comensales y observaciones
        const hayComensalesModificados =
            newOrderData.comensales !== previousOrder.comensales;
        const hayObservacionesModificadas =
            newOrderData.observaciones !== previousOrder.observaciones;
        const hayProductosModificados = productosModificados.length > 0;

        if (
            hayObservacionesModificadas &&
            newOrderData.estado === "En_Preparacion"
        ) {
            toast.warning(
                "No se puede modificar las observaciones de un pedido en preparación.",
            );
            return;
        }

        if (hayComensalesModificados || hayObservacionesModificadas) {
            // Solo cambios en comensales u observaciones, sin cambios de productos
            sendEvent("modifyOrder", {
                orderId: order.idPedido,
                lineNumbers: [],
                data: {
                    cantidadCubiertos: hayComensalesModificados
                        ? newOrderData.comensales
                        : undefined,
                    observacion: hayObservacionesModificadas
                        ? newOrderData.observaciones
                        : undefined,
                },
            });
        }

        // ✅ Procesar productos modificados con lógica de consolidación
        if (hayProductosModificados) {
            productosModificados.forEach((modifiedLp) => {
                // ✅ Encontrar la línea original por NOMBRE Y ESTADO
                const originalLp = previousOrder.lineasPedido.find(
                    (oldLp) =>
                        oldLp.producto._name === modifiedLp.producto._name &&
                        oldLp.estado === modifiedLp.estado, // Buscar por estado también
                );

                if (!originalLp) {
                    return;
                }

                // Si hay múltiples lineNumbers (consolidados), deducir qué eliminar
                if (
                    originalLp.lineNumbers &&
                    originalLp.lineNumbers.length > 1
                ) {
                    const split = splitConsolidatedModification(
                        originalLp,
                        modifiedLp,
                    );

                    // Enviar deletes para los lineNumbers que se reducen
                    split.toDelete.forEach((lineNum) => {
                        sendEvent("deleteOrderLine", {
                            orderId: order.idPedido,
                            lineNumber: lineNum,
                        });
                    });

                    // Enviar modify solo para los lineNumbers a mantener
                    if (split.toModify.length > 0) {
                        sendEvent("modifyOrder", {
                            orderId: order.idPedido,
                            lineNumbers: split.toModify,
                            data: {
                                cantidadCubiertos: undefined,
                                observacion: undefined,
                                items: [
                                    {
                                        cantidad: split.newQuantity,
                                    },
                                ],
                            },
                        });
                    }
                } else {
                    // Línea simple sin consolidación - enviar directamente
                    const lineNumbers = originalLp.lineNumbers || [];

                    sendEvent("modifyOrder", {
                        orderId: order.idPedido,
                        lineNumbers: lineNumbers,
                        data: {
                            cantidadCubiertos: undefined,
                            observacion: undefined,
                            items: [
                                {
                                    cantidad: modifiedLp.cantidad,
                                },
                            ],
                        },
                    });
                }
            });
        } 
        localStorage.removeItem("previousOrder");
        localStorage.removeItem("modification");

        navigate(`/Cliente/Menu/PedidoConfirmado/`);
    };

    const baseButtonStyle = `active:bg-orange-700 hover:scale-105 relative transition-all 
                               ease-linear duration-100 active:scale-95 py-3 px-4 
                               rounded-lg shadow-lg text-white font-bold cursor-pointer`;

    return (
        <section className="p-4 flex flex-col w-full items-center justify-center">
            <div className="md:border flex flex-col justify-between py-4 md:border-gray-300 md:shadow-2xl min-h-[500px] w-full max-w-3xl md:rounded-2xl">
                <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0 mx-5 mb-3 md:items-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Modificar Pedido
                    </h1>
                    <div className="flex gap-1 md:gap-2">
                        <span className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800">
                            Total:
                        </span>
                        <span className="text-sm sm:text-xl md:text-2xl font-bold text-orange-500">
                            {formatCurrency(
                                OrderTotalAmount(order.lineasPedido),
                                "es-AR",
                                "ARS",
                            )}
                        </span>
                    </div>
                </div>

                {/* Vista Móvil */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {order.lineasPedido?.length === 0 && (
                        <>
                            <img
                                src={EmptyOrder}
                                alt="pedido vacio"
                                className="m-auto w-fit"
                            />
                            <p className="text-center">Pedido Vacio</p>
                        </>
                    )}
                    {(() => {
                        const grouped = groupLines(order.lineasPedido, getClientLineType);
                        return TYPE_ORDER.map((type) =>
                            grouped[type] ? (
                                <div key={type}>
                                    <h3 className="text-lg font-semibold text-teal-800 mb-2 border-b border-gray-300 pb-1 capitalize">
                                        {formatTypeName(type)}
                                    </h3>
                                    {grouped[type].map((lp) => (
                                        <div
                                            key={`${lp.producto._name}_${lp.estado}`}
                                            className="flex flex-col gap-2 border #e5e7eb rounded-xl shadow-sm p-3 mb-3"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="font-semibold">
                                                        {lp.producto._name}
                                                    </span>
                                                    <span className="text-sm text-gray-600 max-h-[60px] overflow-y-auto pr-1">
                                                        {lp.producto._description}
                                                    </span>
                                                    <span className="text-orange-600 font-bold">
                                                        {formatCurrency(
                                                            lp.subtotal,
                                                            "es-AR",
                                                            "ARS",
                                                        )}
                                                    </span>
                                                    <span>
                                                        <span className="font-medium">
                                                            {lp.estado
                                                                .replace("_", " ")
                                                                .replace("o", "ó")}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm font-bold">
                                                        Cant: {lp.cantidad}
                                                    </p>
                                                    <p className="text-sm font-bold">
                                                        Precio:{" "}
                                                        {formatCurrency(
                                                            lp.producto._price * lp.cantidad,
                                                            "es-AR",
                                                            "ARS",
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="self-end border rounded-md transition-all duration-200 bg-orange-500 text-white font-medium flex flex-row justify-around items-center gap-1 w-fit">
                                                {lp.estado === "Pendiente" && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemove(lp.producto._name)
                                                        }
                                                        className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 
                                                    'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'`}
                                                    >
                                                        <RemoveCircleOutlineIcon />
                                                    </button>
                                                )}
                                                <p className="px-2 py-1">{lp.cantidad}</p>
                                                {lp.estado === "Pendiente" && (
                                                    <button
                                                        onClick={() => handleAdd(lp)}
                                                        className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'`}
                                                    >
                                                        <ControlPointIcon />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null
                        );
                    })()}

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
                                max={50}
                                id="cantComensales"
                                placeholder="ej:1"
                                className="py-0.5 px-1 w-12 outline-0 rounded-lg bg-gray-200"
                                value={comensalesInput}
                                onChange={(e) =>
                                    handleComensalesChange(
                                        e.currentTarget.value,
                                    )
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="obsMobile">Observaciones: </label>
                            <textarea
                                name="observaciones"
                                className={`rounded-2xl py-2 px-4 outline-0 ${
                                    order.estado === "En_Preparacion"
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gray-200"
                                }`}
                                placeholder="ej: sin cebolla en la hamburguesa"
                                rows={4}
                                maxLength={500}
                                id="obsMobile"
                                value={observacionesInput}
                                onChange={(e) =>
                                    setObservacionesInput(
                                        e.currentTarget.value,
                                    )
                                }
                                disabled={order.estado === "En_Preparacion"}
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
                {order.lineasPedido?.length === 0 ? (
                    <div className="hidden md:block">
                        <img
                            src={EmptyOrder}
                            alt="pedido vacio"
                            className="m-auto w-fit"
                        />
                        <p className="text-center">Pedido Vacio</p>
                    </div>
                ) : (
                    <TableContainer
                        component={Paper}
                        className="hidden md:block w-full"
                    >
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#1e2939" }}>
                                    <TableCell sx={{ color: "white" }}>
                                        Producto
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        Descripción
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ color: "white" }}
                                    >
                                        Cantidad
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ color: "white" }}
                                    >
                                        Precio
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ color: "white" }}
                                    >
                                        Subtotal
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ color: "white" }}
                                    >
                                        Estado
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ color: "white" }}
                                    >
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(() => {
                                    const grouped = groupLines(order.lineasPedido, getClientLineType);
                                    return TYPE_ORDER.map((type) =>
                                        grouped[type] ? (
                                            <React.Fragment key={type}>
                                                <TableRow>
                                                    <TableCell colSpan={7} sx={{ backgroundColor: '#f0fdfa', py: 1 }}>
                                                        <span className="text-lg font-semibold text-teal-800 capitalize">
                                                            {formatTypeName(type)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                                {grouped[type].map((lp) => (
                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                lp.estado ===
                                                    "En_Preparacion" ||
                                                lp.estado === "Terminada"
                                                    ? "#e5e7eb"
                                                    : "white",
                                        }}
                                        key={`${lp.producto._name}_${lp.estado}`}
                                    >
                                        <TableCell>
                                            {lp.producto._name}
                                        </TableCell>
                                        <TableCell>
                                            {lp.producto._description}
                                        </TableCell>
                                        <TableCell align="right">
                                            {lp.cantidad}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(
                                                lp.producto._price,
                                                "es-AR",
                                                "ARS",
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(
                                                lp.subtotal,
                                                "es-AR",
                                                "ARS",
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {lp.estado
                                                .replace("_", " ")
                                                .replace("o", "\u00f3")}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div
                                                className={`self-center border rounded-md transition-all duration-200 bg-orange-500 text-white font-medium flex flex-row justify-around items-center gap-1 w-fit m-auto`}
                                            >
                                                {lp.estado === "Pendiente" && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemove(
                                                                lp.producto
                                                                    ._name,
                                                            )
                                                        }
                                                        className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'
                                                        `}
                                                    >
                                                        <RemoveCircleOutlineIcon />
                                                    </button>
                                                )}
                                                <p
                                                    className={`px-2 py-1 ${lp.estado === "En_Preparacion" || lp.estado === "Terminada" ? "bg-gray-200 text-black border-2 border-black" : "bg-orange-500 text-white"}`}
                                                >
                                                    {lp.cantidad}
                                                </p>
                                                {lp.estado === "Pendiente" && (
                                                    <button
                                                        onClick={() =>
                                                            handleAdd(lp)
                                                        }
                                                        className={`h-full w-full py-1.5 px-2 rounded-md transition-all ease-linear duration-150 'cursor-pointer bg-orange-500 hover:scale-105 hover:bg-orange-600 active:bg-orange-700 active:scale-100'
                                                        `}
                                                    >
                                                        <ControlPointIcon />
                                                    </button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        ) : null
                                    );
                                })()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <div className="hidden md:block p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-3">
                            <label
                                htmlFor="cantComensalesDesktop"
                                className="font-semibold"
                            >
                                Cantidad de comensales:
                            </label>
                            <input
                                required
                                name="cantidad"
                                type="number"
                                min={1}
                                max={50}
                                id="cantComensalesDesktop"
                                placeholder="ej:1"
                                className="py-0.5 px-1 w-12 outline-0 rounded-lg bg-gray-200"
                                value={comensalesInput}
                                onChange={(e) =>
                                    handleComensalesChange(
                                        e.currentTarget.value,
                                    )
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="obsDesktop"
                                className="font-semibold"
                            >
                                Observaciones:{" "}
                            </label>
                            <textarea
                                name="observaciones"
                                className={`rounded-2xl py-2 px-4 outline-0 ${
                                    order.estado === "En_Preparacion"
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gray-200"
                                }`}
                                placeholder="ej: sin cebolla en la hamburguesa"
                                rows={4}
                                id="obsDesktop"
                                maxLength={500}
                                value={observacionesInput}
                                onChange={(e) =>
                                    setObservacionesInput(
                                        e.currentTarget.value,
                                    )
                                }
                                disabled={order.estado === "En_Preparacion"}
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
    );
}
