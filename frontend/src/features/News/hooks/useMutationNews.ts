import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type News from "../interfaces/News";


export function useMutationNews ({fn, currentPage, SuccessMsg, ErrorMsg}: {fn: (data: News) => Promise<News>, currentPage: number, SuccessMsg: string, ErrorMsg: string}) {
    const queryClient = useQueryClient()
    const { mutate, isPending: isLoading } = useMutation({
      mutationFn: fn,
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["News", currentPage]})

        const previousState = await queryClient.getQueryData(["News", currentPage])

        await queryClient.setQueryData(["News", currentPage], (oldData: News[]) => {
          const safeData = Array.isArray(oldData) ? oldData : []
          return [...safeData, newData]
        })

        return { previousState }
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["News"] });
        toast.success(SuccessMsg)
      },
      onError: (err, variables, context) => {
        toast.error(ErrorMsg)
        if (context?.previousState) queryClient.setQueryData(["News", currentPage], context.previousState)
        console.log(err)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({queryKey: ["News"]})
      }
    });
    return { mutate, isLoading }
}