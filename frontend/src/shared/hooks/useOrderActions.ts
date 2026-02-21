import type { OrderLineClientInfo, OrderStatus, Pedido } from "../../features/Order/interfaces/Order"
import type { Bebida, Comida } from "../../features/Products/interfaces/products"
import { addToCart, assignLineNumbers, assignOrderId, confirmOrder, modifyCutleryAmount, modifyObservation, modifyStatus, recoveryCurrentState, removeFromCart } from "../../store/slices/orderSlice"
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

    const handleModifyObservation = (observaciones: string) => {
        dispatch(modifyObservation(observaciones))
    }

    const handleModifyCutleryAmount = (comensales: number) => {
        dispatch(modifyCutleryAmount(comensales))
    }

    const handleRecoveryCurrentState = ({ updatedPreviousOrder }: {updatedPreviousOrder: Pedido}) => {
        dispatch(recoveryCurrentState(updatedPreviousOrder))
    }

    const handleAssignOrderId = (orderId: number) => {
        dispatch(assignOrderId(orderId))
    }

    const handleAssignLineNumbers = ({ nombreProducto, lineNumbers }: { nombreProducto: string, lineNumbers: number[] }) => {
        dispatch(assignLineNumbers({ nombreProducto, lineNumbers }))
    }
    
    const handleModifyOrderStatus = ({ newOrderStatus, orderLinesData } : {newOrderStatus: OrderStatus, orderLinesData: OrderLineClientInfo[]}) => {
        dispatch(modifyStatus({ newOrderStatus, orderLinesData }))
    }


    return { handleAddToCart, hanldeRemoveFromCart, handleConfirmOrder, handleModifyObservation, handleModifyCutleryAmount, handleRecoveryCurrentState, handleAssignOrderId, handleModifyOrderStatus, handleAssignLineNumbers}
}