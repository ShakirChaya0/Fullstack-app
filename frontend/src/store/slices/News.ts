import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type News from "../../features/News/interfaces/News"
import {type BackResults} from "../../features/News/interfaces/News"

interface NewsState {
  items: News[],
  page: number,
  limit: number, 
  totalItems: number
}

const defaultStateNews: NewsState = {
  items: [],
  page: 1,
  limit: 10,
  totalItems: 0
};

export const NewsSlice = createSlice({
    name: "news",
    initialState: defaultStateNews,
    reducers: {
        createNew: (state, action: PayloadAction<News>) =>  {
            const lastId = state.items.at(-1)?._newsId ??  0;
            const news = {
                _newsId: lastId + 1,
                ...action.payload
            }
            state.items.push(news);
            state.totalItems += 1;
            if(state.totalItems >= state.limit * state.page){
                state.page += 1
            }
        },
        setPage: (state, action: PayloadAction<number | undefined>) => {
            if (action.payload && action.payload > 0) {
                state.page = action.payload
            }
        },
        updateNewsId: (state, action: PayloadAction<{ tempId: number; realId: number }>) => {
            const index = state.items.findIndex(news => news._newsId === action.payload.tempId);
            if (index !== -1) {
                state.items[index]._newsId = action.payload.realId;
            }
        },
        setNews: (state, action: PayloadAction<BackResults>) => {
            state.items = action.payload.News
            state.totalItems = action.payload.totalItems
            return state
        },
        updateNews: (state, action: PayloadAction<News>) => {
            const News = state.items.findIndex(news => news._newsId == action.payload._newsId)
            const newNews = {
              ...state.items[News],
              ...action.payload
            }
            state.items[News] = newNews
        },
        deleteNews: (state, action: PayloadAction<number | undefined>) => {
            state.items = state.items.filter(n => n._newsId !== action.payload)
            state.totalItems = state.items.length

            // const lastPage = Math.ceil(state.totalItems / state.limit)
            // if (state.page > lastPage) {
            //   state.page = lastPage 
            // }
        },
        rollbackNews: (state, action: PayloadAction<BackResults>) => {
            state.items = [...action.payload.News]
            state.totalItems += -1 
        }
    } 
})

export default NewsSlice.reducer

export const { createNew, updateNewsId, setNews, updateNews, deleteNews, rollbackNews, setPage } = NewsSlice.actions

