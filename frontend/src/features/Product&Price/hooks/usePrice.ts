import { useQuery } from "@tanstack/react-query";
import { getPriceData } from "../services/product&PriceService";
import { priceNormilizer } from "../utils/priceNormilizer";
import { useMemo } from "react";
import useApiClient from "../../../shared/hooks/useApiClient";

export function usePrice(productId: string | undefined) {
    const { apiCall } = useApiClient();       

    const { data: backendPrice, isLoading, error } = useQuery({
        queryKey: ['priceList', productId],
        queryFn: () => getPriceData(apiCall, productId!),
        enabled: !!productId // Solo se ejecuta la query si productId existe
    });

    const priceList = useMemo(() => {
        return backendPrice ? priceNormilizer(backendPrice) : []
    }, [backendPrice])

    return { priceList, isLoading, error };
}