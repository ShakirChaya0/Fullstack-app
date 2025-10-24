import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderLineClientInfo, OrderStatus, Pedido } from "../../features/Order/interfaces/Order";
import type { Bebida, Comida } from "../../features/Products/interfaces/products";

const defaultState = { idPedido: 0, lineasPedido: [], estado: "Solicitado", observaciones: "", comensales: 0 }

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
            const cantidadLp = state.lineasPedido.map(lp => lp.producto._name).lastIndexOf(action.payload._name)
            const maxLineNumber = state.lineasPedido.length != 0 ? Math.max(...state.lineasPedido.map(l => l.lineNumber ?? 0)) : 0;
            if (cantidadLp === -1){
                state.lineasPedido.push({producto: action.payload, lineNumber: maxLineNumber + 1, estado: "Pendiente", cantidad: 1, subtotal: action.payload._price, tipo: '_type' in action.payload ? (action.payload as Comida)._type : undefined, esAlcoholica: '_isAlcoholic' in action.payload ? (action.payload as Bebida)._isAlcoholic : undefined})
                return state
            } else if (state.lineasPedido[cantidadLp].estado !== 'Pendiente'){
                state.lineasPedido.push({producto: action.payload, lineNumber: maxLineNumber + 1, estado: "Pendiente", cantidad: 1, subtotal: action.payload._price, tipo: '_type' in action.payload ? (action.payload as Comida)._type : undefined, esAlcoholica: '_isAlcoholic' in action.payload ? (action.payload as Bebida)._isAlcoholic : undefined})
                return state
            }
            else{
                const index = state.lineasPedido.map(lp => lp.producto._name).lastIndexOf(action.payload._name)
                const newLp = {
                    ...state.lineasPedido[index],
                    cantidad: state.lineasPedido[index].cantidad + 1,
                    subtotal: state.lineasPedido[index].producto._price * (state.lineasPedido[index].cantidad + 1)
                }
                state.lineasPedido[index] = newLp
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const cantidadLp = state.lineasPedido.map(lp => lp.producto._name).lastIndexOf(action.payload)
            if (cantidadLp === -1) return state
            if (state.lineasPedido[cantidadLp].cantidad === 1){
                const newLps = state.lineasPedido.filter((lp) => lp.producto._name !== action.payload || lp.estado !== 'Pendiente')
                return {...state, lineasPedido: newLps}
            }
            else{
                const index = state.lineasPedido.findIndex((lp) => lp.producto._name === action.payload && lp.estado === 'Pendiente')
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
        },
        recoveryCurrentState: (state, action: PayloadAction<Pedido>) => {
            return action.payload;
        },
        assignOrderId: (state, action: PayloadAction<number>) => {
            console.log('Estoy en orderSlice')
            console.log(action.payload)
            state.idPedido = action.payload
            return state
        },
        assignLineNumber: (state, action: PayloadAction<{ nombreProducto: string, lineNumber: number }>) => {
            const index = state.lineasPedido.findIndex((lp) => lp.producto._name === action.payload.nombreProducto)
            if (index !== -1) {
                state.lineasPedido[index].lineNumber = action.payload.lineNumber
            }
        },
        modifyStatus: (state, action: PayloadAction<{newOrderStatus: OrderStatus, orderLinesData: OrderLineClientInfo[]}>) => { 
            const { newOrderStatus, orderLinesData } = action.payload
            // Se persisten los cambios ya que las validaciones ya fueron hechas en este punto
            if(state.estado !== newOrderStatus) state.estado = newOrderStatus

            state.lineasPedido.forEach((each, index) => {
                if (orderLinesData[index] && each.estado !== orderLinesData[index].estado) {
                    each.estado = orderLinesData[index].estado;
                }
            })
        },
    }
})

export default orderSlice.reducer

export const { addToCart, removeFromCart, confirmOrder, recoveryCurrentState, assignOrderId, assignLineNumber, modifyStatus} = orderSlice.actions