import { useQuery } from "@tanstack/react-query";
import type Information from "../interfaces/Information";
import type Policy from "../interfaces/Policy";
import type { EntityState } from "../pages/Insitution";
import { fetchPolicy } from "../services/fetchPolicy";
import { fetchInformation } from "../services/fetchInformation";


export default function useEntity(entity: EntityState) : [boolean, boolean, Policy | Information | undefined] {

    const {isLoading, isError, data } = useQuery<Policy | Information>({
        queryKey: [entity],
        queryFn: entity === "Policy" ? () => fetchPolicy() : () => fetchInformation(),
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })

    return [isError, isLoading, data] 
}