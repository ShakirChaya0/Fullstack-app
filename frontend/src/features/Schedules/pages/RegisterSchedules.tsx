import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material"
import { useScheduleStateRegister } from "../hooks/useScheduleState"
import { BackButton } from "../../../shared/components/BackButton"
import { RegisterAndModifierTable } from "../components/RegisterAndModifierTable"
import { useMutationRegistration } from "../hooks/useMutationRegistration"
import { incompleteDays } from "../utils/incompleteDays"

export default function RegisterSchedule () {
  // Custom hook para manejar el estado local de horarios
  const {
    schedules,
    updateOpenSchedule,
    updateCloseSchedule,
    error,
    setError
  } = useScheduleStateRegister();

  const { saveSchedulesMutation } = useMutationRegistration({ schedules, setError })

  // Función handleSaveAll que usa la mutation
  const handleSaveAll = () => {
    saveSchedulesMutation.mutate();
  };

  return (
    <Box sx={{ 
      width: { xs: "95%", sm: "90%", md: "80%" }, 
      mx: "auto", 
      mt: 4,
      mb: 4
    }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ color: "black", fontWeight: 'bold', width: {xs: "70%"}}}>
                Gestión de Horarios - Registrar
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
          onClick={handleSaveAll}
          disabled={saveSchedulesMutation.isPending}
          sx={{
            textTransform: "none",
            bgcolor: "#b12e1aff",
            "&:hover": { bgcolor: "#561d03" },
            borderRadius: 2,
            minWidth: "120px",
            flex: 1,
            maxWidth: "200px",
          }}
        >
          { saveSchedulesMutation.isSuccess && (
            <CircularProgress 
              size={20} 
              sx={{ 
                color: "white", 
                marginRight: 1, 
              }} 
            />
          ) }
          { saveSchedulesMutation.isSuccess ? "Guardando..." : "Guardar" }
        </Button>
      </Box>
    </Box>
  );
}
