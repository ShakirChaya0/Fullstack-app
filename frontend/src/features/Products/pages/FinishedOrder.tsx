import { useAppSelector } from "../../../shared/hooks/store";
import { OrderTotalAmount } from "../utils/OrderTotalAmount";
import { useNavigate } from "react-router";
import { PaymentConfirmationModal } from "../../Order/components/GoToPaymentConfirmationModal";
import { StatusIndicator } from "../../Order/components/StatusIndicator";
import { useEffect, useState } from "react";
import type { OrderStatus } from "../../Order/interfaces/Order";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useOrderUpdateHandler } from "../../Order/hooks/useOrderUpdateHandler";

export default function FinishedOrder() {
    const order = useAppSelector((state) => state.order);
    const navigate = useNavigate();
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.estado);

    useOrderUpdateHandler(); // ← toda la lógica del WebSocket vive acá

    useEffect(() => {
        if (
            order.estado !== "Solicitado" &&
            order.estado !== "Completado" &&
            order.estado !== "En_Preparacion"
        ) {
            navigate(`/Cliente/Pedido/Cuenta/${order.idPedido}`);
        }
    }, [order.estado]);

    useEffect(() => {
        setOrderStatus(order.estado);
    }, [order.estado]);

    const handleModify = () => {
        localStorage.setItem("previousOrder", JSON.stringify(order));
        navigate("/Cliente/Menu/ModificarPedido/");
    };

    const handleGoToPayment = () => {
        window.dispatchEvent(new CustomEvent("openPaymentConfirmationModal"));
    };

    return (
        <div className="flex flex-col justify-center w-full">
            <StatusIndicator currentStatus={orderStatus} />
            <section className="flex flex-col w-full items-center h-auto mb-10">
                <div className="md:border flex flex-col py-4 md:border-gray-300 md:shadow-2xl w-full max-w-3xl md:rounded-2xl">
                    <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0 mx-5 mb-3 md:items-center">
                        <h1 className="text-2xl md:text-2xl font-bold text-gray-800">
                            Mi Pedido
                        </h1>
                        <div className="flex gap-1 md:gap-2">
                            <span className="text-gray-800 font-bold text-lg md:text-2xl">
                                Total:
                            </span>
                            <span className="text-orange-500 font-bold text-lg md:text-2xl">
                                {formatCurrency(
                                    OrderTotalAmount(order.lineasPedido),
                                    "es-AR",
                                    "ARS",
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-3">
                        {order.lineasPedido.map((lp) => (
                            <div
                                key={`${lp.producto._name}_${lp.estado}`}
                                className="flex flex-col gap-2 border border-gray-300 rounded-xl shadow-sm p-3"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col max-w-[200px]">
                                        <span className="font-semibold">
                                            {lp.producto._name}
                                        </span>
                                        <span className="text-sm text-gray-600 pr-1">
                                            {lp.producto._description}
                                        </span>
                                        <span className="text-orange-600 font-bold">
                                            {formatCurrency(
                                                lp.subtotal,
                                                "es-AR",
                                                "ARS",
                                            )}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">
                                            Cant: {lp.cantidad}
                                        </p>
                                        <p className="text-sm font-bold">
                                            Estado: {lp.estado}
                                        </p>
                                        <p className="text-sm font-bold">
                                            Precio:{" "}
                                            {formatCurrency(
                                                lp.producto._price *
                                                    lp.cantidad,
                                                "es-AR",
                                                "ARS",
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-row gap-2 justify-between">
                            <label className="font-bold text-gray-700">
                                Cantidad de comensales:
                            </label>
                            <span className="text-gray-900 font-bold">
                                {order.comensales}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-gray-700">
                                Observaciones:
                            </label>
                            <span className="text-gray-900 italic p-2 bg-gray-100 rounded-lg border border-gray-200 min-h-[40px]">
                                {order.observaciones || "Sin observaciones."}
                            </span>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                className="active:bg-orange-700 hover:scale-105 relative transition-all ease-linear duration-100 active:scale-95 m-auto py-2 px-4 bg-orange-500 rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
                                onClick={handleModify}
                            >
                                Modificar Pedido
                            </button>
                            <button
                                className={`m-auto py-2 px-4 rounded-lg shadow-lg text-white font-bold transition-all ${
                                    order.estado === "Completado"
                                        ? "bg-orange-500 cursor-pointer hover:bg-orange-600 active:bg-orange-700 hover:scale-105 active:scale-95"
                                        : "bg-gray-400 text-gray-300 cursor-not-allowed opacity-50"
                                }`}
                                onClick={handleGoToPayment}
                                disabled={order.estado !== "Completado"}
                            >
                                Pagar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <PaymentConfirmationModal />
        </div>
    );
}
