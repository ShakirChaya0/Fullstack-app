import { createNew, deleteNews, setNews, setPage, updateNews } from "../../../store/slices/News";
import { useAppDispatch } from "../../../shared/hooks/store";
import {type BackResults} from "../interfaces/News";

export const useNewsActions = () => {
    const dispatch = useAppDispatch()

    const handleCreateNews = (_title: string, _description: string, _startDate: string, _endDate: string) => {
        dispatch(createNew({_title, _description, _startDate, _endDate}))
    }
    const handleSetNews = (data: BackResults) => {
        dispatch(setNews(data))
    }
    const handleDeleteNews = (id?: number) => {
        dispatch(deleteNews(id))
    }
    const handleUpdateNews = (_newsId: number | undefined, _title: string, _description: string, _startDate: string, _endDate: string) => {
        dispatch(updateNews({_newsId, _title, _description, _startDate, _endDate}))
    }
    const handleSetPage = (page: number) => {
        dispatch(setPage(page))
    }
    return {handleCreateNews, handleSetNews, handleDeleteNews, handleUpdateNews, handleSetPage}
}