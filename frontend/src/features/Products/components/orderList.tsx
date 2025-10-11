import { useState } from "react"
import EmptyOrder from "../assets/empty-order.svg"
import { useAppSelector } from "../../../shared/hooks/store"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useOrderActions } from "../../../shared/hooks/useOrderActions";
import { NavLink } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { LineaPedido } from "../../Order/interfaces/Order";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { OrderTotalAmount } from "../utils/OrderTotalAmount";

export function OrderList () {
  const [isOpen, setOpen] = useState(false)
  const order = useAppSelector((state) => state.order)
  const { handleAddToCart, hanldeRemoveFromCart } = useOrderActions()

  const handleAdd = (lp: LineaPedido) => {
    handleAddToCart(lp.producto)
  }
  const handleRemove = (name: string) => {
    hanldeRemoveFromCart({nombreProducto: name})
  }

  const handleClick = () => {
      setOpen(!isOpen)
  }

  const isValidModification = localStorage.getItem('modification')

    return(
      <>
        <button 
          onClick={handleClick}
          className={
            `group hidden md:flex fixed top-43 -right-18 
             bg-orange-500 text-white rounded-l-full h-14 w-[140px]
             shadow-lg items-center pl-4 hover:w-[250px]
             hover:bg-orange-600 active:bg-orange-700 
              z-50 cursor-pointer gap-3 transition-all duration-300 delay-100
              ease-in-out ${isOpen ? "-translate-x-96" : ""}`}
        >
          <LocalGroceryStoreIcon />

          <span
            className="opacity-0 translate-x-4 group-hover:opacity-100 
              group-hover:translate-x-0
             text-white font-semibold text-base 
             transition-all duration-300 ease-in-out"
          >
            Mi Pedido
          </span>
        </button>

        { isOpen && <div className="fixed inset-0 bg-black opacity-70 z-40" onClick={() => setOpen(false)}></div>}
        <aside 
            className={
                `
                /* Mobile */
                shadow-2xl border p-4 border-gray-300 rounded-t-2xl md:rounded-2xl
                 bg-white bottom-0 left-0 w-full 
                fixed z-50 overflow-auto transition-all md:transition-transform duration-500
                ${isOpen ? "h-9/12 z-50" : "h-[85px]"}

                /* Desktop */
                md:fixed md:top-0 md:w-96 md:block md:left-12/12 md:h-full md:rounded-none
                ${isOpen ? "md:-translate-x-2/2" : ""}
                 `}
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
                          className="flex flex-col gap-3"
                        >
                          <AnimatePresence>
                            {order.lineasPedido.map((lp) => (
                              <motion.div
                                key={lp.producto._name}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="flex py-0 shadow-none border-0 border-b-2 flex-col xl:flex-row
                                           justify-evenly md:justify-between md:border border-gray-300 md:shadow-lg
                                           md:py-2 md:px-4 md:rounded-lg"
                              >
                                <div className="flex flex-col w-full">
                                  <div className="flex flex-row justify-between mb-2">
                                    <div className="flex">
                                      <h1 className="font-medium md:text-2xl">{lp.producto._name}</h1>
                                    </div>
                                    <div
                                      className="self-start border rounded-md 
                                      transition-all duration-200 bg-orange-500
                                      text-white font-medium flex flex-row justify-around 
                                      items-center gap-1 w-fit"
                                    >
                                      <button
                                        onClick={() => handleRemove(lp.producto._name)}
                                        className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                                        hover:bg-orange-600 rounded-l-md transition-all ease-linear duration-150
                                        active:bg-orange-700 active:scale-100"
                                      >
                                        <RemoveCircleOutlineIcon/>
                                      </button>
                                      <p>{lp.cantidad}</p>
                                      <button
                                        onClick={() => handleAdd(lp)}
                                        className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                                        hover:bg-orange-600 rounded-r-md transition-all ease-linear duration-150 
                                        active:bg-orange-700 active:scale-100"
                                      >
                                        <ControlPointIcon/>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-end gap-2 mb-3">
                                    <p className="text-sm md:text-lg">{lp.producto._description}</p>
                                    <p className="text-orange-500 font-bold">${lp.subtotal.toFixed(2)}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        <div className="flex justify-between md:justify-around">
                          <span className="text-orange-500 font-bold text-2xl">Total: </span>
                          <span className="text-orange-500 font-bold text-2xl">${OrderTotalAmount(order.lineasPedido).toFixed(2)}</span>
                        </div>
                      
                        <div className="p-4">
                          <NavLink to={isValidModification === 'true' ? '/Cliente/Menu/ModificarPedido' : '/Cliente/Menu/RealizarPedido'}>
                            <button className="w-full py-3 cursor-pointer bg-orange-500
                             hover:bg-orange-600 hover:scale-105 text-white font-bold rounded-lg shadow-md 
                             transition-all ease-linear duration-150 active:bg-orange-700 active:scale-95">
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