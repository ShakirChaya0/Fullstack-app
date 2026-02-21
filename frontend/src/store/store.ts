import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./slices/orderSlice";
import orderStorageMiddleware from "./middlewares/orderStorageMiddleware";



export const store = configureStore({
    reducer: {
        order: orderSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(orderStorageMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch