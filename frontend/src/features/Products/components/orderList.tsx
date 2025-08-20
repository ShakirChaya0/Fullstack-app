import { useState } from "react"
import EmptyOrder from "../assets/empty-order.svg"


export function OrderList () {
    const [isOpen, setOpen] = useState(false)
    const pedidos = false
    
    const handleClick = () => {
        setOpen(!isOpen)
    }

    return(
        <aside 
            className={`shadow-2xl md:h-100 border p-4 border-gray-300 rounded-2xl bg-white md:col-start-2 md:sticky md:top-0 col-start-1 bottom-0 left-0 w-full sticky z-10 overflow-hidden transition-all duration-500 md:transition-none ${isOpen ? "h-[500px]" : "h-[85px]"}`}
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
            !pedidos &&
                <>
                    <img src={EmptyOrder} alt="pedido vacio" className="m-auto w-fit"/>
                    <p className="text-center">Pedido Vacio</p>
                </>
            }
        </aside>
    )
}