import {
    Box,
    Typography,
    Alert,
} from "@mui/material";
import { Suspense, lazy } from "react";
import { getScheduleData } from "../shared/sheduleService";
import { useQuery } from "@tanstack/react-query";
import { sortAndNormalizeSchedules } from "../hooks/useScheduleState";
import { LoadingSchedule } from "../components/LoadingSchedule";
import { SkeletonScheduleTable } from "./SkeletonScheduleTable";
import { ModifySchedulesButton } from "../components/ModifySchedulesButton";
import { RegisterSchedulesButton } from "../components/RegisterSchedulesButton";
import useApiClient from "../../../shared/hooks/useApiClient";

// Lazy load del componente ScheduleTable
const ScheduleTable = lazy(() => import("../components/ScheduleTable").then(module => ({ default: module.ScheduleTable })));

export default function MainPanelSchedules() {
    const { apiCall } = useApiClient()

    const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['schedules'],
        queryFn: () => getScheduleData(apiCall),
        retry: false
    });

    if (queryLoading) return <LoadingSchedule/>
    

    if (queryError && queryError.name !== "NotFoundError") {
      return (
        <Box sx={{ width: "80%", mx: "auto", mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                    Gestión de Horarios
                </Typography>
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
                <Typography variant="h4" sx={{ color: "black", fontWeight: 'bold' }}>
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
                    <Suspense fallback={<SkeletonScheduleTable />}>
                        <ScheduleTable schedules={ schedules }></ScheduleTable>
                    </Suspense>
                )
            }
            <Box
                display="flex"
                justifyContent="end"
                alignItems="center"
                marginTop="1rem"
                marginX="1rem"
                gap={2}
            >
                { 
                    schedules.length === 0 ?
                    (
                        <RegisterSchedulesButton schedules={ schedules }></RegisterSchedulesButton>
                    ) :
                    (
                        <ModifySchedulesButton schedules={ schedules }></ModifySchedulesButton>
                    )
                }
            </Box>
        </Box>
    )
}