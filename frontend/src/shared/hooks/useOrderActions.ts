import type { Bebida, Comida } from "../../features/Products/interfaces/products"
import { addToCart, assignOrderId, confirmOrder, recoveryInitialState, removeFromCart } from "../../store/slices/orderSlice"
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

    return { handleAddToCart, hanldeRemoveFromCart, handleConfirmOrder, handleRecoveyInitialState, handleAssignOrderId}
}