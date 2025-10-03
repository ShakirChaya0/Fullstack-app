
import { useAppSelector } from "../../../shared/hooks/store"
import { OrderTotalAmount } from "../utils/OrderTotalAmount"
import { useNavigate } from "react-router"
import { PaymentConfirmationModal } from "../../Schedules/components/GoToPaymentConfirmationModal"

export default function FinishedOrder() {
    const order = useAppSelector((state) => state.order)
    const navigate = useNavigate()

    const handleModify = () => {
        localStorage.setItem("previousOrder", JSON.stringify(order))
        navigate('/Cliente/Menu/RealizarPedido/')
    }

    const handleGoToPayment = () => {
        window.dispatchEvent(new CustomEvent('openPaymentConfirmationModal'))
    }

    return (
        <>
            <section className="p-4 flex flex-col w-full items-center h-auto">
                <div 
                    className="md:border flex flex-col py-4 md:border-gray-300 md:shadow-2xl 
                    w-full max-w-3xl md:rounded-2xl"
                >
                    <div className="flex flex-row justify-between mx-5 my-3">
                        <h1 className="text-2xl font-bold text-center text-gray-800">Mi Pedido</h1>
                        <div className="flex">
                            <span className="text-gray-800 font-bold text-2xl">Total:</span>
                            <span className="text-orange-500 font-bold text-2xl ml-1">${OrderTotalAmount(order.lineasPedido).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-3">
                        {order.lineasPedido.map((lp) => (
                            <div
                                key={lp.producto._name}
                                className="flex flex-col gap-2 border border-gray-300 rounded-xl shadow-sm p-3"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col max-w-[200px]">
                                        <span className="font-semibold">{lp.producto._name}</span>
                                        <span className="text-sm text-gray-600 pr-1">{lp.producto._name}</span>
                                        <span className="text-orange-600 font-bold">${lp.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">Cant: {lp.cantidad}</p>
                                        <p className="text-sm font-bold">Precio: ${(lp.producto._price * lp.cantidad).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-row gap-2">
                            <label className="font-semibold">
                                Cantidad de comensales: 
                            </label>
                            <span>{order.comensales}</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <label className="font-semibold">Observaciones: </label>
                            <span>{order.observaciones}</span>            
                        </div>
                        <div className="flex justify-between mt-4">
                            <button 
                                className="active:bg-orange-700 hover:scale-105 relative transition-all 
                                ease-linear duration-100 active:scale-95 m-auto py-2 px-4 bg-orange-500 
                                rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
                                onClick={handleModify}
                            >
                                Modificar Pedido
                            </button>
                            <button 
                                className="active:bg-orange-700 hover:scale-105 transition-all 
                                ease-linear duration-100 active:scale-95 m-auto py-2 px-4 bg-orange-500 
                                rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
                                onClick={handleGoToPayment}
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <PaymentConfirmationModal/>
        </>
    )
}