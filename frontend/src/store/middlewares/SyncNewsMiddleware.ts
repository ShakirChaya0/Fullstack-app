import { type Middleware } from "@reduxjs/toolkit";
import type News from "../../features/News/interfaces/News";
import { toast } from "react-toastify";
import { rollbackNews, updateNewsId } from "../slices/News";

export const SyncNewsMiddleware: Middleware = (store) => (next) => async (action) => {
  const previousState = store.getState().news
  next(action)

  switch (action.type) {
    case "news/createNew" :
      try { 
        const latestNews: News = store.getState().news.items.at(-1);
        const tempId = latestNews?._newsId ?? 0;

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

        if(!response.ok) throw new Error("error")
        
        const data = await response.json()
        if (data._newsId) {
          const realId = data._newsId;
          store.dispatch(updateNewsId({ tempId, realId }));
        }

        toast.success("Se registro exitosamente")
      } catch (error) {
        console.log(previousState)
        store.dispatch(rollbackNews(previousState))
        toast.error("Error al cargar la novedad")
        
        console.error("Error sincronizando noticias:", error);
      }
      break
    case "news/deleteNews":
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades/${action.payload}`, {
          method: "DELETE"
        })
        if (!response.ok) throw new Error("error")
        toast.success("Se elimino exitosamente la novedad")
      } catch (error) {
        store.dispatch(rollbackNews(previousState))
        toast.error("Error al eliminar la novedad")
        console.log(error)
      }
      break
    case "news/updateNews":
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/novedades/${action.payload._newsId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: action.payload._title,
            descripcion: action.payload._description,
            fechaInicio: action.payload._startDate,
            fechaFin: action.payload._endDate
          })
        })
        if(!response.ok) throw new Error("Error")
        toast.success("Se modifico con exito la novedad")
      } catch (error) {
        store.dispatch(rollbackNews(previousState))
        toast.error("Error al modificar una novedad")
        console.log(error)
      } 
      break
  }

  return action;
};
