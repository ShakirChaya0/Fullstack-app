import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect } from "react";
import type { ProfileData, UniqueProfileData } from "../types/ProfileSharedTypes";
import { useProfileMutation } from "../hooks/useProfileMutation";
import { getFieldConfigs } from "../services/getFieldConfig";
import useAuth from "../../../shared/hooks/useAuth";
import type { Client } from "../../Login/interfaces/Client";
import dateParser from "../../../shared/utils/dateParser";

interface ProfileFormProps {
    profile: UniqueProfileData,
    editMode: boolean,
    onEditModeChange: (editing: boolean) => void,
}

export default function ProfileForm({ profile, editMode , onEditModeChange }: ProfileFormProps) {
    const { user } = useAuth();
    const { mutate, isPending } = useProfileMutation(onEditModeChange);
    const fieldConfigs = getFieldConfigs();

    const { register, reset, handleSubmit, formState: { errors } } = useForm<ProfileData>({
        defaultValues: profile as ProfileData,
    });

    const handleReset = () => {
        if (profile) {
            const formattedProfile = { ...profile };
            
            if ('fechaNacimiento' in profile && profile.fechaNacimiento) {
                (formattedProfile as Client).fechaNacimiento = new Date(profile.fechaNacimiento).toISOString().split("T")[0];
            }
            
            reset(formattedProfile as ProfileData);
        }
    }

    useEffect(() => handleReset(), [profile, reset]);

    const onSubmit = (data: ProfileData) => {
        const formattedData = { ...data };

        if ('fechaNacimiento' in formattedData && formattedData.fechaNacimiento) {
            (formattedData as Client).fechaNacimiento = dateParser(formattedData.fechaNacimiento);
        }

        mutate({ userData: formattedData, userType: user!.tipoUsuario });
    };

    return (
        <section className="w-full flex flex-col items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full pl-6 pr-6 pb-4 items-center justify-center gap-6">

                {fieldConfigs
                    .filter((f) => f.show(profile))
                    .map((field) => (
                        <TextField
                            key={String(field.name)}
                            label={field.label}
                            size="small"
                            fullWidth
                            type={field.type || "text"}
                            variant={editMode ? "outlined" : "standard"}
                            disabled={!editMode || isPending}
                            error={!!errors[field.name as keyof ProfileData]}
                            helperText={errors[field.name as keyof ProfileData]?.message}
                            {...register(field.name as keyof ProfileData, field.rules)}
                            name={String(field.name)}
                            {...(field.type === "date" && {
                              slotProps: { inputLabel: { shrink: true } },
                            })}
                        />
                    ))
                }

                {editMode && (
                    <div className="flex flex-col-reverse sm:flex-row justify-center gap-5 mb-4 mt-2">
                        <Button color="inherit" variant="outlined" startIcon={<CancelIcon />} onClick={() => { handleReset(); onEditModeChange(false); }} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="warning" loading={isPending} loadingPosition="start" startIcon={<SaveIcon />} variant="contained">
                            Guardar
                        </Button>
                    </div>
                )}

            </form>
        </section>
    )
}