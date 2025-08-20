import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type News from "../../features/News/interfaces/News"
import type NewsWithOutID from "../../features/News/interfaces/News"
import { toast } from "react-toastify";

const defaultStateNews: News[] = []

export const NewsSlice = createSlice({
    name: "news",
    initialState: defaultStateNews,
    reducers: {
        createNew: (state, action: PayloadAction<NewsWithOutID>) =>  {
            state.push(action.payload);
            toast.success("Novedad creada con exito")
            console.log("estado:", state)
        },
        setNews: (state, action: PayloadAction<News[]>) => {
            state = action.payload
            return state
        }
    } 
})

export default NewsSlice.reducer

export const { createNew, setNews } = NewsSlice.actions

