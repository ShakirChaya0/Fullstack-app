import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useScheduleStateModify } from "../hooks/useScheduleState";
import { getScheduleData } from "../shared/sheduleService";
import { BackButton } from "../../../shared/components/BackButton"
import { SuccessNotification } from "../components/SuccessNotification";
import { LoadingSchedule } from "../components/LoadingSchedule";
import { RegisterAndModifierTable } from "../components/RegisterAndModifierTable";
import { useMutationModification } from "../hooks/useMutationModification";
import { incompleteDays } from "../utils/incompleteDays";
import useApiClient from "../../../shared/hooks/useApiClient";

export function ModifySchedule () {  
  // React Query para obtener datos del backend
  const { apiCall } = useApiClient()

  const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => getScheduleData(apiCall)
  });

  // Custom hook para manejar el estado local de horarios
  const {
    schedules,
    originalSchedule,
    updateOpenSchedule,
    updateCloseSchedule,
    error,
    setError
  } = useScheduleStateModify(backendSchedules);

  const { modifySchedulesMutation } = useMutationModification({schedules, originalSchedule, setError})

  // Función handleSaveAll que usa la mutation
  const handleModifyAll = () => {
    modifySchedulesMutation.mutate();
  };

  if (queryLoading) return <LoadingSchedule/>

  if (queryError) {
    return (
      <Box sx={{ width: "80%", mx: "auto", mt: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold', width: {xs: "70%"}}}>
            Gestión de Horarios - Modificar
          </Typography>
          <BackButton url="/Admin/Horarios"></BackButton>
        </Box>
        <Alert severity="error">
          Error al cargar horarios
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: { xs: "95%", sm: "90%", md: "80%" }, 
      mx: "auto", 
      mt: 4,
      mb: 4
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold', width: {xs: "70%"}}}>
          Gestión de Horarios - Modificar
        </Typography>
        <BackButton url="/Admin/Horarios"></BackButton>
      </Box>

      {error && (
          <Alert severity="error" sx={{ mb: 3, border: "1px solid black" }}>
              {error} {incompleteDays(schedules) && `- ${incompleteDays(schedules)}`} 
          </Alert>
      )}

      <RegisterAndModifierTable 
        schedules={schedules}
        updateOpenSchedule={updateOpenSchedule}
        updateCloseSchedule={updateCloseSchedule}
      ></RegisterAndModifierTable>

      <Box
        display="flex"
        justifyContent="end"
        marginTop="1rem"
        marginX="1rem"
        gap={2}
      >
        <Button
          variant="contained"
          onClick={handleModifyAll}
          disabled={modifySchedulesMutation.isPending}
          sx={{
            bgcolor: "#b12e1aff",
            "&:hover": { bgcolor: "#561d03" },
            borderRadius: 2,
            minWidth: "120px",
            flex: 1,
            maxWidth: "200px",
          }}
        >
          {modifySchedulesMutation.isSuccess && (
            <CircularProgress 
              size={20} 
              sx={{ 
                color: "white", 
                marginRight: 1 
              }} 
            />
          )}
          { modifySchedulesMutation.isSuccess ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
      <SuccessNotification activation={ modifySchedulesMutation.isSuccess }></SuccessNotification>
    </Box>
  );
}
