import type News from "../interfaces/News";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../services/fetchNews";
import { useEffect } from "react";
import { useNewsActions } from "./useNewsActions"

export function useNews () {
    const { handleSetNews } = useNewsActions()
    const {isLoading, isError, data} = useQuery<{News: News[]}>({
        queryKey: ["News"],
        queryFn: fetchNews,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })

    useEffect(() => {
        if (data) {
          handleSetNews(data.News) 
        }
    }, [data, handleSetNews]);
    
    return {isLoading, isError}
}