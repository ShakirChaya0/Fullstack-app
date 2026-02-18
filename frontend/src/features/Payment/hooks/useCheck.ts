import { useQuery } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import type { CheckType } from "../types/PaymentSharedTypes";
import { generateCheck } from "../services/generateCheck";
import { useAppSelector } from "../../../shared/hooks/store";

export function useCheck(idPedido?: string | null) {
    const { apiCall } = useApiClient();
    const order = useAppSelector((state) => state.order);
    const id = idPedido ? +idPedido : order.idPedido

    const { data, isLoading, isError } = useQuery<CheckType>({
        queryKey: ["check"],
        queryFn: () => generateCheck(id, apiCall),
        staleTime: Infinity, 
        refetchOnWindowFocus: false,
        retry: 1
    });

    return { data, isLoading, isError }
}