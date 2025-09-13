import { useState } from "react"
import EmptyOrder from "../assets/empty-order.svg"
import { useAppSelector } from "../../../shared/hooks/store"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import type { LineaPedido } from "../../../store/slices/orderSlice";
import { NavLink } from "react-router";


export function OrderList () {
    const [isOpen, setOpen] = useState(false)
    const order = useAppSelector((state) => state.order)
    const { handleAddToCart, hanldeRemoveFromCart } = useOrderActions()

    const handleAdd = (lp: LineaPedido) => {
      handleAddToCart({nombreProducto: lp.nombreProducto, descripcion: lp.descripcion, precio: lp.precio})
    }
    const handleRemove = (name: string) => {
      hanldeRemoveFromCart({nombreProducto: name})
    }

    const handleClick = () => {
        setOpen(!isOpen)
    }

    return(
      <>
        { isOpen && <div className="fixed inset-0 bg-black opacity-70 z-40 md:hidden"></div>}
        <aside 
            className={
                `shadow-2xl border p-4 border-gray-300 rounded-t-2xl md:rounded-2xl
                 bg-white md:col-start-2 md:sticky md:top-0 col-start-1 bottom-0 left-0 w-full 
                 fixed z-50 overflow-hidden transition-all duration-500 md:transition-none md:h-fit
                 max-h-[874px]
                 ${isOpen ? "h-9/12 z-50" : "h-[85px]"}`}
        >
            <div onClick={handleClick}>
                <div className="flex justify-center">
                    <button className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" fill="currentColor" className={`size-6 md:hidden sm:block ${isOpen ? "rotate-180" : ""}`}>
                            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <h1 className="text-center text-2xl">Mi Pedido</h1>
            </div>
            {
                order.lineasPedido?.length === 0 &&
                <>
                    <img src={EmptyOrder} alt="pedido vacio" className="m-auto w-fit"/>
                    <p className="text-center">Pedido Vacio</p>
                </>
            }
            {
                order.lineasPedido?.length !== 0 &&
                <>
                    <div className="flex flex-col gap-3 p-4 w-full">
                        <div
                          className="
                            flex flex-col gap-3
                            max-h-[400px] overflow-y-auto 
                            md:max-h-[684px] 
                          "
                        >
                          {order.lineasPedido.map((lp) => (
                            <div
                              key={lp.nombreProducto}
                              className="flex py-0 shadow-none border-0 border-b-2 h-fit flex-col xl:flex-row justify-evenly md:justify-between md:border border-gray-300 md:shadow-lg md:py-2 md:px-4 min-h-[150px] md:rounded-lg"
                            >
                                <div className="md:flex md:flex-col justify-between">
                                    <h1 className="font-medium md:text-2xl">{lp.nombreProducto}</h1>
                                    <p className="max-h-[60px] md:max-h-[72px] overflow-y-auto text-sm md:text-lg">{lp.descripcion}</p>
                                    <p className="text-orange-500 font-bold">${lp.subtotal}</p>
                                </div>
                              <div
                                className="self-center border group hover:border-orange-500 
                                rounded-md hover:bg-white transition-all duration-200 bg-orange-500
                                text-white font-medium flex flex-row justify-around items-center gap-1"
                              >
                                <button onClick={() => handleAdd(lp)} className="cursor-pointer h-full w-full py-1.5 px-2">
                                  <ControlPointIcon className="group-hover:text-orange-500" />
                                </button>
                                <p className="group-hover:text-orange-500">{lp.cantidad}</p>
                                <button onClick={() => handleRemove(lp.nombreProducto)} className="cursor-pointer h-full w-full py-1.5 px-2">
                                  <RemoveCircleOutlineIcon className="group-hover:text-orange-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      
                        <div className="p-4">
                          <NavLink to="/Menu/RealizarPedido">
                            <button className="w-full py-3 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md transition">
                              Completar  Pedido
                            </button>
                          </NavLink>
                        </div>
                    </div>
                </>
            }
        </aside>
      </>
    )
}