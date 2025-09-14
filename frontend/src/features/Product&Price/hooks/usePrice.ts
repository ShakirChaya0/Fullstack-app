import { useQuery } from "@tanstack/react-query";
import { getPriceData } from "../services/product&PriceService";
import { priceNormilizer } from "../utils/priceNormilizer";
import { useMemo } from "react";

export function usePrice(productId: string | undefined) {

    const { data: backendPrice, isLoading, error } = useQuery({
        queryKey: ['priceList', productId],
        queryFn: () => getPriceData(productId!),
        enabled: !!productId // Solo se ejecuta la query si productId existe
    });

    const priceList = useMemo(() => {
        return backendPrice ? priceNormilizer(backendPrice) : []
    }, [backendPrice])

    return { priceList, isLoading, error };
}