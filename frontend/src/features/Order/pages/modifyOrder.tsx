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
import { PaymentConfirmationModal } from "../../Schedules/components/GoToPaymentConfirmationModal";
import { useWebSocket } from "../../../shared/hooks/useWebSocket";
import { useEffect, useRef, useState, useCallback } from "react";
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import type { OrderStatus, LineaPedido } from "../../Order/interfaces/Order";

interface OrderLineClientInfo {
    nombreProducto: string,
    cantidad: number,
    estado: string,
}

export interface OrderClientInfo {
    idPedido: number
    lineasPedido: OrderLineClientInfo[],
    estado: OrderStatus,
    observaciones: string
}

const EmptyOrderPlaceholder = "https://placehold.co/150x150/f9fafb/374151?text=Pedido+Vacío";

export default function ModifyOrder() {
    const navigate = useNavigate();
    const order = useAppSelector((state) => state.order);
    const {
        handleAddToCart,
        hanldeRemoveFromCart,
        handleConfirmOrder,
        handleModifyOrderStatus
    } = useOrderActions();

    const comensalesRef = useRef<HTMLInputElement>(null);
    const observacionesRef = useRef<HTMLTextAreaElement>(null);

    const handleAdd = useCallback((lp: LineaPedido) => {
        handleAddToCart(lp.producto);
    }, [handleAddToCart]);

    const handleRemove = useCallback((name: string) => {
        hanldeRemoveFromCart({ nombreProducto: name });
    }, [hanldeRemoveFromCart]);

    const handleStatusChangeRef = useRef((data: OrderClientInfo) => {
        handleModifyOrderStatus(data.estado);
    });

    useEffect(() => {
        handleStatusChangeRef.current = (data: OrderClientInfo) => {
            handleModifyOrderStatus(data.estado);
        };
    }, [handleModifyOrderStatus]);

    const { sendEvent } = useWebSocket();
    
    const handleAddProduct = () => {
        navigate('/Cliente/Menu/')
    }

    const handleConfirmModification = () => {
        const comensales = comensalesRef.current ? parseInt(comensalesRef.current.value, 10) : order.comensales;
        const observaciones = observacionesRef.current ? observacionesRef.current.value : order.observaciones;

        if (comensales <= 0) {
            console.error('No se puede registrar un pedido con número de comensales menor a 1');
            return;
        }
        if (observaciones.length > 500) {
            console.error('La observación debe tener menos de 500 caracteres');
            return;
        }

        handleConfirmOrder({
            comensales: comensales,
            observaciones: observaciones,
        })

        sendEvent("modifyOrder", {
            orderId: order.idPedido,
            lineNumber: order.lineasPedido.map(lp => lp.lineNumber),
            data: {
                cantidadCubiertos: order.comensales,
                observacion: order.observaciones,
                items: [
                    order.lineasPedido.map(lp => ({
                        cantidad: lp.cantidad
                    }))
                ]
            }
        });

        navigate(`/Cliente/Menu/PedidoConfirmado/`)
    }

    const baseButtonStyle = `active:bg-orange-700 hover:scale-105 relative transition-all 
                               ease-linear duration-100 active:scale-95 py-3 px-4 
                               rounded-lg shadow-lg text-white font-bold cursor-pointer`;

    return (
        <section className="p-4 flex flex-col w-full items-center justify-center">
            <div className="md:border flex flex-col justify-between py-4 md:border-gray-300 md:shadow-2xl min-h-[500px] w-full max-w-3xl md:rounded-2xl">

                <div className="flex flex-row justify-between mx-5 mb-3">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Modificar Pedido</h1>
                    <div className="flex">
                        <span className="text-gray-800 font-bold text-2xl">Total:</span>
                        <span className="text-orange-500 font-bold text-2xl ml-1">${OrderTotalAmount(order.lineasPedido).toFixed(2)}</span>
                    </div>
                </div>

                {/* Vista Móvil */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {
                        order.lineasPedido?.length === 0 &&
                        <>
                            <img src={EmptyOrderPlaceholder} alt="pedido vacio" className="m-auto w-fit" />
                            <p className="text-center mb-4">Pedido Vacio</p>
                        </>
                    }
                    {order.lineasPedido.map((lp) => (
                        <div
                            key={lp.producto._name}
                            className="flex flex-col gap-2 border border-gray-300 rounded-xl shadow-sm p-3"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col max-w-[200px]">
                                    <span className="font-semibold">{lp.producto._name}</span>
                                    <span className="text-sm text-gray-600 max-h-[60px] overflow-y-auto pr-1">
                                        {lp.producto._description}
                                    </span>
                                    <span className="text-orange-600 font-bold">
                                        ${lp.subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-bold">Cant: {lp.cantidad}</p>
                                    <p className="text-sm font-bold">Precio: ${(lp.producto._price * lp.cantidad).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="self-end border rounded-md transition-all duration-200 bg-orange-500 text-white font-medium flex flex-row justify-around items-center gap-1 w-fit">
                                <button
                                    onClick={() => handleRemove(lp.producto._name)}
                                    className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105 hover:bg-orange-600 rounded-l-md transition-all ease-linear duration-150 active:bg-orange-700 active:scale-100"
                                >
                                    <RemoveCircleOutlineIcon />
                                </button>
                                <p>{lp.cantidad}</p>
                                <button
                                    onClick={() => handleAdd(lp)}
                                    className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105 hover:bg-orange-600 rounded-r-md transition-all ease-linear duration-150 active:bg-orange-700 active:scale-100"
                                >
                                    <ControlPointIcon />
                                </button>
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
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="obsMobile">Observaciones: </label>
                            <textarea
                                name="observaciones"
                                className="bg-gray-200 rounded-2xl py-2 px-4 outline-0"
                                placeholder="ej: sin cebolla en la hamburguesa"
                                rows={4}
                                id="obsMobile"
                                ref={observacionesRef}
                                defaultValue={order.observaciones}
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
                            <img src={EmptyOrderPlaceholder} alt="pedido vacio" className="m-auto w-fit" />
                            <p className="text-center mb-4">Pedido Vacio</p>
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
                                        <TableCell align="center" sx={{ color: "white" }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.lineasPedido.map((lp) => (
                                        <TableRow key={lp.producto._name}>
                                            <TableCell>{lp.producto._name}</TableCell>
                                            <TableCell>{lp.producto._description}</TableCell>
                                            <TableCell align="right">{lp.cantidad}</TableCell>
                                            <TableCell align="right">${lp.producto._price.toFixed(2)}</TableCell>
                                            <TableCell align="right">${lp.subtotal.toFixed(2)}</TableCell>
                                            <TableCell align="center">
                                                <div className="self-center border rounded-md transition-all duration-200 bg-orange-500 text-white font-medium flex flex-row justify-around items-center gap-1 w-fit m-auto">
                                                    <button
                                                        onClick={() => handleRemove(lp.producto._name)}
                                                        className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105 hover:bg-orange-600 rounded-l-md transition-all ease-linear duration-150 active:bg-orange-700 active:scale-100"
                                                    >
                                                        <RemoveCircleOutlineIcon />
                                                    </button>
                                                    <p>{lp.cantidad}</p>
                                                    <button
                                                        onClick={() => handleAdd(lp)}
                                                        className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105 hover:bg-orange-600 rounded-r-md transition-all ease-linear duration-150 active:bg-orange-700 active:scale-100"
                                                    >
                                                        <ControlPointIcon />
                                                    </button>
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
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="obsDesktop" className="font-semibold">Observaciones: </label>
                            <textarea
                                name="observaciones"
                                className="bg-gray-200 rounded-2xl py-2 px-4 outline-0"
                                placeholder="ej: sin cebolla en la hamburguesa"
                                rows={4}
                                id="obsDesktop"
                                ref={observacionesRef}
                                defaultValue={order.observaciones}
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