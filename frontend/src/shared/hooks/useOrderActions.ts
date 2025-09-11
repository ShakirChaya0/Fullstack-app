import { addToCart, removeFromCart } from "../../store/slices/orderSlice"
import { useAppDispatch } from "./store"


export const useOrderActions = () => {
    const dispatch = useAppDispatch()

    const handleAddToCart = ({nombreProducto, descripcion, precio}: {nombreProducto: string, descripcion: string, precio: number}) => {
        dispatch(addToCart({nombreProducto, descripcion, precio}))
    }

    const hanldeRemoveFromCart = ({nombreProducto}: {nombreProducto: string}) => {
        dispatch(removeFromCart(nombreProducto))
    }

    return { handleAddToCart, hanldeRemoveFromCart }
}