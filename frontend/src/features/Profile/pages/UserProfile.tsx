import { useCallback, useState } from "react";
import { Chip, Divider, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import useUserProfile from "../hooks/useUserProfile";
import useAuth from "../../../shared/hooks/useAuth";
import type { UserType } from "../types/ProfileSharedTypes";
import ProfileForm from "../components/ProfileForm";
import ProfileCardSkeleton from "../components/ProfileCardSkeleton";

export default function UserProfile() {
    const { user } = useAuth();
    const { data: profile, isLoading, isError } = useUserProfile(user!.username, user!.tipoUsuario as UserType);
    const [editMode, setEditMode] = useState(false);

    const handleModeChange = useCallback((editing: boolean) => {
        setEditMode(editing);
    }, []);

    if (isLoading)
        return (
            <ProfileCardSkeleton />
        );

    if (isError || !profile)
        return (
          <div className="flex justify-center">
                <Typography>Error al cargar los datos de su perfil, inténtelo más tarde.</Typography>
          </div>
        );

    return (
        <div className="p-6 max-w-7xl w-3xl mx-auto">
            <Paper elevation={8} className="flex flex-col p-6 h-full w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 mt-6 ml-6 max-w-7xl">Mi Perfil</h1>
                    {!editMode && (
                        <Tooltip title="Editar perfil">
                            <IconButton onClick={() => setEditMode(true)}><EditIcon /></IconButton>
                        </Tooltip>   
                    )}
                </div>

                <div className="p-2 w-full">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center gap-2 w-full">
                            <Typography variant="h5">{(profile as any).nombre || profile.nombreUsuario}</Typography>
                            <Typography variant="h6">@{profile.nombreUsuario}</Typography>
                        </div>

                        <Divider className="w-full flex items-center justify-center">
                            <Chip label={user!.tipoUsuario} size="medium" color="warning"/>
                        </Divider>
                        
                        <ProfileForm profile={profile} editMode={editMode} onEditModeChange={handleModeChange} />

                    </div>
                </div>
            </Paper>
        </div>
    );
}
