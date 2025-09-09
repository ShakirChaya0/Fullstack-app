import { addToCart, removeFromCart } from "../../store/slices/orderSlice"
import { useAppDispatch } from "./store"


export const useOrderActions = () => {
    const dispatch = useAppDispatch()

    const handleAddToCart = ({nombreProducto}: {nombreProducto: string}) => {
        dispatch(addToCart(nombreProducto))
    }

    const hanldeRemoveFromCart = ({nombreProducto}: {nombreProducto: string}) => {
        dispatch(removeFromCart(nombreProducto))
    }

    return { handleAddToCart, hanldeRemoveFromCart }
}