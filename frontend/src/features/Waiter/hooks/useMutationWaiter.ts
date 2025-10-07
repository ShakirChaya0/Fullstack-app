import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Waiter } from "../interfaces/Waiters";
import useApiClient from "../../../shared/hooks/useApiClient";


export function useMutationWaiter ({fn, SuccessMsg, ErrorMsg}: {fn: (apiCall: (url: string, options?: RequestInit) => Promise<Response>, data: Waiter) => Promise<Waiter>, currentPage: number, SuccessMsg: string, ErrorMsg: string, query: string}) {
    const queryClient = useQueryClient()
    const { apiCall } = useApiClient()

    const { mutate, isPending: isLoading, failureReason } = useMutation({
      mutationFn: (data: Waiter) => fn(apiCall, data),
      onSuccess: () => {
        toast.success(SuccessMsg)
      },
      onError: (err) => {
        toast.error(ErrorMsg)
        console.log(err)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({queryKey: ["Waiters"]})
      }
    });
    return { mutate, isLoading, failureReason }
}