import EmptyOrder from "../assets/empty-order.svg"


export function OrderList () {
    const pedidos = false
    return(
        <aside className="md:h-100 border p-4 border-gray-300 rounded-2xl bg-white md:col-start-2 md:sticky md:top-0 sm:col-start-1 sm:fixed sm:bottom-0 sm:left-0 sm:w-full sm:h-64 z-10">
            <h1 className="text-center text-2xl">Mi Pedido</h1>
            {
            !pedidos &&
                <>
                    <img src={EmptyOrder} alt="asjdbaksd" className="m-auto w-fit"/>
                    <p className="text-center">Pedido Vacio</p>
                </>
            }
        </aside>
    )
}