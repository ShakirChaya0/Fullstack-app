import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { UniqueProfileData, UserType } from "../types/ProfileSharedTypes";
import { updateUser } from "../services/updateUser";
import useAuth from "../../../shared/hooks/useAuth";

export function useProfileMutation(onEditModeChange: (editing: boolean) => void) {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userData, userType }: { userData: UniqueProfileData; userType: UserType }) => 
            updateUser(userData, userType, accessToken!),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["User"] });
            toast.success("Perfil actualizado con éxito.");
            onEditModeChange(false);
        },
        onError: (error) => {
            toast.error(`Error al actualizar el perfil: ${error.message}`);
        },
    });
}