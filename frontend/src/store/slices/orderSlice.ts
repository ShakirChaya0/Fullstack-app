import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderStatus, Pedido } from "../../features/Order/interfaces/Order";
import type { Bebida, Comida } from "../../features/Products/interfaces/products";

const defaultState = { idPedido: 0, lineasPedido: [], estado: "", observaciones: "", comensales: 0 }

const initialState: Pedido = (() => {
    const persistedState = localStorage.getItem("order")
    if (persistedState) return JSON.parse(persistedState)
    return defaultState
})()

export const orderSlice = createSlice({
    name: "order",
    initialState: initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Comida | Bebida>) => {
            const cantidadLp = state.lineasPedido.findIndex((lp) => lp.producto._name === action.payload._name)
            if (cantidadLp === -1){
                state.lineasPedido.push({producto: action.payload, estado: "", cantidad: 1, subtotal: action.payload._price})
                return state
            }
            else{
                const index = state.lineasPedido.findIndex((lp) => lp.producto._name === action.payload._name)
                const newLp = {
                    ...state.lineasPedido[index],
                    cantidad: state.lineasPedido[index].cantidad + 1,
                    subtotal: state.lineasPedido[index].producto._price * (state.lineasPedido[index].cantidad + 1)
                }
                state.lineasPedido[index] = newLp
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const cantidadLp = state.lineasPedido.findIndex((lp) => lp.producto._name === action.payload)
            if (state.lineasPedido[cantidadLp].cantidad === 1){
                const newLps = state.lineasPedido.filter((lp) => lp.producto._name !== action.payload)
                return {...state, lineasPedido: newLps}
            }
            else{
                const index = state.lineasPedido.findIndex((lp) => lp.producto._name === action.payload)
                const newLp = {
                    ...state.lineasPedido[index],
                    cantidad: state.lineasPedido[index].cantidad - 1,
                    subtotal: state.lineasPedido[index].producto._price * (state.lineasPedido[index].cantidad - 1)
                }
                state.lineasPedido[index] = newLp
            }
        },
        confirmOrder: (state, action: PayloadAction<{comensales: number, observaciones: string}>) => {
            const { comensales, observaciones } = action.payload
            
            // Se persisten los cambios ya que las validaciones ya fueron hechas en este punto
            state.comensales = comensales
            state.observaciones = observaciones
            state.estado = 'Solicitado'
        },
        recoveryInitialState: (state) => {
            //Actualizamos estado de Redux
            Object.assign(state, defaultState);
        },
        assignOrderId: (state, action: PayloadAction<number>) => {
            console.log('Estoy en orderSlice')
            console.log(action.payload)
            state.idPedido = action.payload
            return state
        },
        modifyStatus: (state, action: PayloadAction<OrderStatus>) => { 
            // Se persisten los cambios ya que las validaciones ya fueron hechas en este punto
            state.estado = action.payload
        },
    }
})

export default orderSlice.reducer

export const { addToCart, removeFromCart, confirmOrder, recoveryInitialState, assignOrderId, modifyStatus} = orderSlice.actions