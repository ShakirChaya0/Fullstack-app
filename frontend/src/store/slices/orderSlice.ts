import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LineaPedido = {
    nombreProducto: string,
    descripcion: string,
    precio: number,
    cantidad: number,
    estado: string,
    subtotal: number,
}

type Pedido = {
    lineasPedido: LineaPedido[],
    estado: string,
    observaciones: string,
    comensales: number
}

const defaultState = {lineasPedido: [], estado: "", observaciones: "", comensales: 0}

const initialState: Pedido = (() => {
    const persistedState = localStorage.getItem("order")
    if (persistedState) return JSON.parse(persistedState)
    return defaultState
})()

export const orderSlice = createSlice({
    name: "order",
    initialState: initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{nombreProducto: string, descripcion: string, precio: number}>) => {
            const cantidadLp = state.lineasPedido.findIndex((lp) => lp.nombreProducto === action.payload.nombreProducto)
            if (cantidadLp === -1){
                state.lineasPedido.push({nombreProducto: action.payload.nombreProducto, estado: "", cantidad: 1, descripcion: action.payload.descripcion, precio: action.payload.precio, subtotal: action.payload.precio})
                return state
            }
            else{
                const index = state.lineasPedido.findIndex((lp) => lp.nombreProducto === action.payload.nombreProducto)
                const newLp = {
                    ...state.lineasPedido[index],
                    cantidad: state.lineasPedido[index].cantidad + 1,
                    subtotal: state.lineasPedido[index].precio * (state.lineasPedido[index].cantidad + 1)
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
                    cantidad: state.lineasPedido[index].cantidad - 1,
                    subtotal: state.lineasPedido[index].precio * (state.lineasPedido[index].cantidad - 1)
                }
                state.lineasPedido[index] = newLp
            }
        },
        confirmOrder: (state, action: PayloadAction<{comensales: number, observaciones: string}>) => {
            console.log(action)
        }
    }
})

export default orderSlice.reducer

export const { addToCart, removeFromCart, confirmOrder } = orderSlice.actions