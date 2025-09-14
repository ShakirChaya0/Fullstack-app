import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../services/getUserData";
import type { UserType } from "../types/ProfileSharedTypes";
import type { Client } from "../../Login/interfaces/Client";
import type { Waiter } from "../../Waiter/interfaces/Waiters";
import type { Kitchen } from "../interfaces/Kitchen";
import type { Admin } from "../interfaces/Admin";
import useAuth from "../../../shared/hooks/useAuth";

export default function useUserProfile(userId: string, userType: UserType) {
    const { accessToken } = useAuth()

    const { isLoading, isError, data } = useQuery<Admin | Client | Waiter | Kitchen>({
        queryKey: ["User"],
        queryFn: () => getUserData(userId, userType, accessToken!),
        staleTime: 1000 * 60 * 60,
    })
    
    return { isLoading, isError, data }
}