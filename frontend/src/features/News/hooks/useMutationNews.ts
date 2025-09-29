import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type News from "../interfaces/News";
import type { BackResults } from "../interfaces/News";
import useApiClient from "../../../shared/hooks/useApiClient";


export function useMutationNews ({fn, currentPage, SuccessMsg, ErrorMsg, query, filter}: {fn: (apiCall: (url: string, options?: RequestInit) => Promise<Response>, data: News) => Promise<News>, currentPage: number, SuccessMsg: string, ErrorMsg: string, query: string, filter: string}) {
    const queryClient = useQueryClient()
    const { apiCall } = useApiClient()

    const { mutate, isPending: isLoading, failureReason } = useMutation({
      mutationFn: (data: News) => fn(apiCall, data),
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["News", currentPage, query, filter]})
        
        const previousState = queryClient.getQueryData(["News", currentPage, query, filter])

        queryClient.setQueryData(["News", currentPage, query, filter], (oldData?: BackResults) => {
          if (!oldData) return { News: [newData], totalItems: 1, pages: 1 }
          const newNews = [newData, ...oldData.News]
          const NewData = {
            ...oldData,
            News: newNews,
            totalItems: oldData.totalItems + 1
          }
          
          return NewData
        })
      
        return { previousState }
      },
      onSuccess: () => {
        toast.success(SuccessMsg)
      },
      onError: (err, variables, context) => {
        toast.error(ErrorMsg)
        if (context?.previousState != null) queryClient.setQueryData(["News", currentPage], context.previousState)
        console.log(err)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({queryKey: ["News"]})
      }
    });
    return { mutate, isLoading, failureReason }
}