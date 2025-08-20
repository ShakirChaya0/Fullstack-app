import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type News from "../../features/News/interfaces/News"

const defaultStateNews: News[] = []

export const NewsSlice = createSlice({
    name: "news",
    initialState: defaultStateNews,
    reducers: {
        createNew: (state, action: PayloadAction<News>) =>  {
            state.push(action.payload);
        },
        setNews: (state, action: PayloadAction<News[]>) => {
            state = action.payload
            return state
        },
        rollbackNews: (state, action: PayloadAction<News[]>) => {
            return [...action.payload]
        }
    } 
})

export default NewsSlice.reducer

export const { createNew, setNews, rollbackNews } = NewsSlice.actions

