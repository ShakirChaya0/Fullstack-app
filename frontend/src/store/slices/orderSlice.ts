import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderLineClientInfo, OrderStatus, Pedido } from "../../features/Order/interfaces/Order";
import type { Bebida, Comida } from "../../features/Products/interfaces/products";
import type { OrderLineStatus } from "../../features/KitchenOrders/types/SharedTypes";

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
            const maxLineNumber = state.lineasPedido.length !== 0
                ? Math.max(...state.lineasPedido.map(l => l.lineNumber ?? 0))
                : 0

            // Buscar la última línea Pendiente del mismo producto
            const pendingIndex = state.lineasPedido
                .map((lp, i) => ({ lp, i }))
                .filter(({ lp }) => lp.producto._name === action.payload._name && lp.estado === 'Pendiente')
                .pop()?.i

            if (pendingIndex !== undefined) {
                // Incrementar la existente
                const lp = state.lineasPedido[pendingIndex]
                state.lineasPedido[pendingIndex] = {
                    ...lp,
                    cantidad: lp.cantidad + 1,
                    subtotal: lp.producto._price * (lp.cantidad + 1)
                }
            } else {
                // Crear nueva línea (no existe ninguna Pendiente de este producto)
                state.lineasPedido.push({
                    producto: action.payload,
                    lineNumber: maxLineNumber + 1,
                    estado: "Pendiente",
                    cantidad: 1,
                    subtotal: action.payload._price,
                    tipo: '_type' in action.payload ? (action.payload as Comida)._type : undefined,
                    esAlcoholica: '_isAlcoholic' in action.payload ? (action.payload as Bebida)._isAlcoholic : undefined
                })
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            // Buscar siempre la última línea Pendiente del producto
            const index = state.lineasPedido
                .map((lp, i) => ({ lp, i }))
                .filter(({ lp }) => lp.producto._name === action.payload && lp.estado === 'Pendiente')
                .pop()?.i

            if (index === undefined) return state

            if (state.lineasPedido[index].cantidad === 1) {
                state.lineasPedido.splice(index, 1)
            } else {
                const lp = state.lineasPedido[index]
                state.lineasPedido[index] = {
                    ...lp,
                    cantidad: lp.cantidad - 1,
                    subtotal: lp.producto._price * (lp.cantidad - 1)
                }
            }
        },
        confirmOrder: (state, action: PayloadAction<{ comensales: number, observaciones: string }>) => {
            const { comensales, observaciones } = action.payload

            // Se persisten los cambios ya que las validaciones ya fueron hechas en este punto
            state.comensales = comensales
            state.observaciones = observaciones
        },
        modifyObservation: (state, action: PayloadAction<string>) => {
            state.observaciones = action.payload
        },
        modifyCutleryAmount: (state, action: PayloadAction<number>) => {
            state.comensales = action.payload
        },
        recoveryCurrentState: (state, action: PayloadAction<Pedido>) => {
            return action.payload; //Se utiliza el return ya que se esta sobreescribiendo el estado global de forma completa
        },
        assignOrderId: (state, action: PayloadAction<number>) => {
            state.idPedido = action.payload
        },
        assignLineNumber: (state, action: PayloadAction<{ nombreProducto: string, lineNumber: number }>) => {
            const index = state.lineasPedido.findIndex((lp) => lp.producto._name === action.payload.nombreProducto)
            if (index !== -1) {
                state.lineasPedido[index].lineNumber = action.payload.lineNumber
            }
        },
        modifyStatus: (state, action: PayloadAction<{ newOrderStatus: OrderStatus, orderLinesData: OrderLineClientInfo[] }>) => {
            const { newOrderStatus, orderLinesData } = action.payload

            if (state.estado !== newOrderStatus) state.estado = newOrderStatus

            state.lineasPedido.forEach((each) => {
                // Buscar por lineNumber, no por índice
                const matchingLine = orderLinesData.find(
                    serverLine => serverLine.nroLinea === each.lineNumber
                )
                if (matchingLine && each.estado !== matchingLine.estado) {
                    each.estado = matchingLine.estado as OrderLineStatus
                }
            })
        }
    }
})

export default orderSlice.reducer

export const { addToCart, removeFromCart, confirmOrder, modifyObservation, modifyCutleryAmount, recoveryCurrentState, assignOrderId, assignLineNumber, modifyStatus } = orderSlice.actions