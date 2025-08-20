import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./slices/News"
import { SyncNewsMiddleware } from "./middlewares/SyncNewsMiddleware";



export const store = configureStore({
    reducer: {
        news: newsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(SyncNewsMiddleware),
}) 

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch