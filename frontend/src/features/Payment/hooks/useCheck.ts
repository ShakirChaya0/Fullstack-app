import { useQuery } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import type { CheckType } from "../types/PaymentSharedTypes";
import { generateCheck } from "../services/generateCheck";
import { useAppSelector } from "../../../shared/hooks/store";

export function useCheck() {
    const { apiCall } = useApiClient();
    const order = useAppSelector((state) => state.order);
    
    const { data, isLoading, isError } = useQuery<CheckType>({
        queryKey: ["check"],
        queryFn: () => generateCheck(1, apiCall), // cambiar el 1 a order.idPedido
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1
    });

    return { data, isLoading, isError }
}