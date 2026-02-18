import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { UniqueProfileData, UserType } from "../types/ProfileSharedTypes";
import { updateUser } from "../services/updateUser";
import { useApiClient } from "../../../shared/hooks/useApiClient";
import useAuth from "../../../shared/hooks/useAuth";

export function useProfileMutation(onEditModeChange: (editing: boolean) => void) {
    const { apiCall } = useApiClient();
    const { user, setUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userData }: { userData: UniqueProfileData }) => 
            updateUser(userData, user!.tipoUsuario, user!.idUsuario, apiCall),
        onSuccess: async ({ userType, userData, verifiedEmail }: { userType: UserType, userData: UniqueProfileData, verifiedEmail: boolean }) => {
            await queryClient.invalidateQueries({ queryKey: ["User", user?.idUsuario] });
            toast.success("Perfil actualizado con éxito.");

            if (userType === "Cliente" && !verifiedEmail) 
                toast.warning("Se ha enviado un email de verificación a su nueva dirección de correo electrónico. Por favor, verifique su correo para continuar utilizando la aplicación con normalidad.")

            setUser({ idUsuario: user!.idUsuario, email: userData.email!, tipoUsuario: user!.tipoUsuario, username: userData.nombreUsuario });
            onEditModeChange(false);
        },
        onError: (error) => {
            toast.error(`Error al actualizar el perfil: ${error.message}`);
        },
    });
}