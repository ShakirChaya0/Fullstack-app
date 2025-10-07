import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type News from "../interfaces/News";
import useApiClient from "../../../shared/hooks/useApiClient";


export function useMutationNews ({fn, SuccessMsg, ErrorMsg}: {fn: (apiCall: (url: string, options?: RequestInit) => Promise<Response>, data: News) => Promise<News>, currentPage: number, SuccessMsg: string, ErrorMsg: string, query: string, filter: string}) {
    const queryClient = useQueryClient()
    const { apiCall } = useApiClient()

    const { mutate, isPending: isLoading, failureReason } = useMutation({
      mutationFn: (data: News) => fn(apiCall, data),
      onSuccess: () => {
        toast.success(SuccessMsg)
      },
      onError: (err) => {
        toast.error(ErrorMsg)
        console.log(err)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({queryKey: ["News"]})
      }
    });
    return { mutate, isLoading, failureReason }
}