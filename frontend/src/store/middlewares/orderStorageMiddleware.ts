import type { Middleware } from "@reduxjs/toolkit";

const orderStorageMiddleware: Middleware = (store) => (next) => (action) => {
    next(action)
    localStorage.setItem("order", JSON.stringify(store.getState()))
}

export default orderStorageMiddleware