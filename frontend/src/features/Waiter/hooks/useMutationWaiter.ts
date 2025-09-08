import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Waiter } from "../interfaces/Waiters";


export function useMutationWaiter ({fn, currentPage, SuccessMsg, ErrorMsg}: {fn: (data: Waiter) => Promise<Waiter>, currentPage: number, SuccessMsg: string, ErrorMsg: string}) {
    const queryClient = useQueryClient()
    const { mutate, isPending: isLoading } = useMutation({
      mutationFn: fn,
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["Waiters", currentPage]})

        const previousState = await queryClient.getQueryData(["Waiters", currentPage])

        await queryClient.setQueryData(["Waiters", currentPage], (oldData: Waiter[]) => {
          const safeData = Array.isArray(oldData) ? oldData : []
          return [...safeData, newData]
        })

        return { previousState }
      },
      onSuccess: () => {
        toast.success(SuccessMsg)
      },
      onError: (err, variables, context) => {
        toast.error(ErrorMsg)
        if (context?.previousState) queryClient.setQueryData(["Waiters", currentPage], context.previousState)
        console.log(err)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({queryKey: ["Waiters"]})
      }
    });
    return { mutate, isLoading }
}