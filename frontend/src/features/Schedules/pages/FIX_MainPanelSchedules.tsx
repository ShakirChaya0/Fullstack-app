import {
    Box,
    Typography,
    Alert,
} from "@mui/material";
import { getScheduleData } from "../shared/sheduleService";
import { useQuery } from "@tanstack/react-query";
import { sortAndNormalizeSchedules } from "../hooks/useScheduleState";
import { LoadingSchedule } from "../components/FIX_LoadingSchedule";
import { ScheduleTable } from "../components/ScheduleTable";
import { ModifySchedulesButton } from "../components/ModifySchedulesButton";
import { RegisterSchedulesButton } from "../components/RegisterSchedulesButton";

export function MainPanelSchedules() {

    const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['schedules'],
        queryFn: getScheduleData
    });

    if (queryLoading) return <LoadingSchedule/>
    

    if (queryError && queryError.name !== "NotFoundError") {
      return (
        <Box sx={{ width: "80%", mx: "auto", mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                    Gestión de Horarios
                </Typography>
                {/* Agregar button volver en caso de ser necesario */}
            </Box>
          <Alert severity="error">
            Error al cargar horarios
          </Alert>
        </Box>
      );
    }

    const schedules = backendSchedules ? sortAndNormalizeSchedules(backendSchedules) : []

    return (
        <Box sx={{ 
            width: { xs: "95%", sm: "90%", md: "80%" }, 
            mx: "auto", 
            mt: 4,
            mb: 4
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                    Gestión de Horarios
                </Typography>
            </Box>
            {
                schedules.length === 0 ? 
                (
                    <Alert severity="info">
                        No hay horarios registrados.
                    </Alert>
                ) :
                (
                    <> {/* Ver si se puede sacar después del Suspence */}
                        <ScheduleTable schedules={ schedules }></ScheduleTable>
                    </>
                )
            }
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop="1rem"
                marginX="1rem"
                gap={2}
            >
                <ModifySchedulesButton schedules={ schedules }></ModifySchedulesButton>
                <RegisterSchedulesButton schedules={ schedules }></RegisterSchedulesButton>
            </Box>
        </Box>
    )
}