import { createNew, setNews } from "../../../store/slices/News";
import { useAppDispatch } from "../../../shared/hooks/store";
import type  News  from "../interfaces/News";

export const useNewsActions = () => {
    const dispatch = useAppDispatch()

    const handleCreateNews = (_title: string, _description: string, _startDate: string, _endDate: string) => {
        dispatch(createNew({_title, _description, _startDate, _endDate}))
    }
    const handleSetNews = (data: News[]) => {
        dispatch(setNews(data))
    }
    return {handleCreateNews, handleSetNews}
}