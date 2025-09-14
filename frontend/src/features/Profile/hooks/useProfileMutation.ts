import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ProfileData } from "../types/ProfileSharedTypes";

export function useProfileMutation(onEditModeChange: (editing: boolean) => void) {
    return useMutation({
        mutationFn: async (data: ProfileData) => {
            // Replace with your API call for update
            await new Promise((r) => setTimeout(r, 1000));
            return data;
        },
        onSuccess: () => {
            toast.success("Perfil actualizado con éxito.");
            onEditModeChange(false);
        },
        onError: () => {
            toast.error("Error al actualizar el perfil. Inténtelo de nuevo más tarde.");
        },
    });
}