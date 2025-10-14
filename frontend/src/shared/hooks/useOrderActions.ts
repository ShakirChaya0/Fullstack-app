import type { OrderLineClientInfo, OrderStatus } from "../../features/Order/interfaces/Order"
import type { Bebida, Comida } from "../../features/Products/interfaces/products"
import { addToCart, assignLineNumber, assignOrderId, confirmOrder, modifyStatus, recoveryInitialState, removeFromCart } from "../../store/slices/orderSlice"
import { useAppDispatch } from "./store"


export const useOrderActions = () => {
    const dispatch = useAppDispatch()

    const handleAddToCart = (producto: Comida | Bebida) => {
        dispatch(addToCart(producto))
    }

    const hanldeRemoveFromCart = ({nombreProducto}: {nombreProducto: string}) => {
        dispatch(removeFromCart(nombreProducto))
    }

    const handleConfirmOrder = ({comensales, observaciones}: {comensales: number, observaciones: string}) => {
        dispatch(confirmOrder({comensales: comensales, observaciones: observaciones}))
    }

    const handleRecoveyInitialState = () => {
        dispatch(recoveryInitialState())
    }

    const handleAssignOrderId = (orderId: number) => {
        dispatch(assignOrderId(orderId))
    }

    const handleAssignLineNumber = ({ nombreProducto, lineNumber }: { nombreProducto: string, lineNumber: number }) => {
        dispatch(assignLineNumber({ nombreProducto, lineNumber }))
    }
    
    const handleModifyOrderStatus = ({ newOrderStatus, orderLinesData } : {newOrderStatus: OrderStatus, orderLinesData: OrderLineClientInfo[]}) => {
        dispatch(modifyStatus({ newOrderStatus, orderLinesData }))
    }


    return { handleAddToCart, hanldeRemoveFromCart, handleConfirmOrder, handleRecoveyInitialState, handleAssignOrderId, handleModifyOrderStatus, handleAssignLineNumber}
}