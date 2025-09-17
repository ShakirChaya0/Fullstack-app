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
        onSuccess: async ({ verifiedEmail }: { verifiedEmail: boolean }) => {
            await queryClient.invalidateQueries({ queryKey: ["User"] });
            toast.success("Perfil actualizado con éxito.");

            if (!verifiedEmail) toast.warning("Se ha enviado un email de verificación a su nueva dirección de correo electrónico. Por favor, verifique su correo para continuar utilizando la aplicación con normalidad.")
            onEditModeChange(false);
        },
        onError: (error) => {
            toast.error(`Error al actualizar el perfil: ${error.message}`);
        },
    });
}