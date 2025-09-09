import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LineaPedido = {
    nombreProducto: string,
    cantidad: number,
    estado: string
}

type Pedido = {
    lineasPedido: LineaPedido[],
    estado: string,
    observaciones: string
}

const defaultState = {lineasPedido: [], estado: "", observaciones: ""}

const initialState: Pedido = (() => {
    const persistedState = localStorage.getItem("order")
    if (persistedState) return JSON.parse(persistedState).order
    return defaultState
})()

export const orderSlice = createSlice({
    name: "order",
    initialState: initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<string>) => {
            const cantidadLp = state.lineasPedido.findIndex((lp) => lp.nombreProducto === action.payload)
            if (cantidadLp === -1){
                state.lineasPedido.push({nombreProducto: action.payload, estado: "", cantidad: 1})
                return state
            }
            else{
                const index = state.lineasPedido.findIndex((lp) => lp.nombreProducto === action.payload)
                const newLp = {
                    ...state.lineasPedido[index],
                    cantidad: state.lineasPedido[index].cantidad + 1
                }
                state.lineasPedido[index] = newLp
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const cantidadLp = state.lineasPedido.findIndex((lp) => lp.nombreProducto === action.payload)
            if (state.lineasPedido[cantidadLp].cantidad === 1){
                const newLps = state.lineasPedido.filter((lp) => lp.nombreProducto !== action.payload)
                return {...state, lineasPedido: newLps}
            }
            else{
                const index = state.lineasPedido.findIndex((lp) => lp.nombreProducto === action.payload)
                const newLp = {
                    ...state.lineasPedido[index],
                    cantidad: state.lineasPedido[index].cantidad - 1
                }
                state.lineasPedido[index] = newLp
            }
        }
    }
})

export default orderSlice.reducer

export const { addToCart, removeFromCart } = orderSlice.actions