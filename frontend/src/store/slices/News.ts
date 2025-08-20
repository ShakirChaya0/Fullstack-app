import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type News from "../../features/News/interfaces/News"

const defaultStateNews: News[] = []

export const NewsSlice = createSlice({
    name: "news",
    initialState: defaultStateNews,
    reducers: {
        createNew: (state, action: PayloadAction<News>) =>  {
            const lastId = state.at(-1)?._newsId ??  0;
            const news = {
                _newsId: lastId + 1,
                ...action.payload
            }
            state.push(news);
        },
        updateNewsId: (state, action: PayloadAction<{ tempId: number; realId: number }>) => {
            const index = state.findIndex(news => news._newsId === action.payload.tempId);
            if (index !== -1) {
                state[index]._newsId = action.payload.realId;
            }
        },
        setNews: (state, action: PayloadAction<News[]>) => {
            state = action.payload
            return state
        },
        updateNews: (state, action: PayloadAction<News>) => {
            const News = state.findIndex(news => news._newsId == action.payload._newsId)
            const newNews = {
              ...state[News],
              ...action.payload
            }
            state[News] = newNews
            return state
        },
        deleteNews: (state, action: PayloadAction<number | undefined>) => {
            const id = action.payload
            return state.filter((news) => news._newsId !== id)
        },
        rollbackNews: (state, action: PayloadAction<News[]>) => {
            return [...action.payload]
        }
    } 
})

export default NewsSlice.reducer

export const { createNew, updateNewsId, setNews, updateNews, deleteNews, rollbackNews } = NewsSlice.actions

