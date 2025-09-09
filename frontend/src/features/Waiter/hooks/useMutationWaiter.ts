import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { BackResults, Waiter } from "../interfaces/Waiters";


export function useMutationWaiter ({fn, currentPage, SuccessMsg, ErrorMsg, query}: {fn: (data: Waiter) => Promise<Waiter>, currentPage: number, SuccessMsg: string, ErrorMsg: string, query: string}) {
    const queryClient = useQueryClient()
    const { mutate, isPending: isLoading, failureReason } = useMutation({
      mutationFn: fn,
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["Waiters", currentPage, query]})

        const previousState = queryClient.getQueryData(["Waiters", currentPage, query])

        queryClient.setQueryData(["Waiters", currentPage, query], (oldData?: BackResults) => {
          if (!oldData) return { Waiters: [newData], totalItems: 1, pages: 1 }
          const newWaiters = [newData, ...oldData.Waiters]
          const NewData = {
            ...oldData,
            Waiters: newWaiters,
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
        if (context?.previousState != null) queryClient.setQueryData(["Waiters", currentPage, query], context.previousState)
        console.log(err)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({queryKey: ["Waiters"]})
      }
    });
    return { mutate, isLoading, failureReason }
}