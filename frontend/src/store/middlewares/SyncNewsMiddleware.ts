import { type Middleware } from "@reduxjs/toolkit";
import type News from "../../features/News/interfaces/News";

export const SyncNewsMiddleware: Middleware = (store) => (next) => async (action) => {
  const { type, payload} = action;
  const previousState = store.getState().news
  let newState = previousState
  next(action)


  if (action.type === "news/createNew") {
    try { 
      const latestNews: News = store.getState().news.at(-1);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: latestNews?._title,
          descripcion: latestNews?._description,
          fechaInicio: latestNews?._startDate,
          fechaFin: latestNews?._endDate
        })
      });
      const data = await response.json()
    } catch (error) {
      console.error("Error sincronizando noticias:", error);
    }
  }

  return newState;
};
