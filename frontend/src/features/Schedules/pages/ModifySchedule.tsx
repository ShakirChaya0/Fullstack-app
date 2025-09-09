import { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useScheduleStateModify } from "../hooks/useScheduleState";
import { getScheduleData, modifySchedulesToBackend } from "../shared/sheduleService";
import { BackButton } from "../components/backButton";
import { SuccessNotification } from "../utils/SuccessNotification";

export function ModifySchedule () {
  const [tab, setTab] = useState(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  
  // React Query para obtener datos del backend
  const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['schedules'],
    queryFn: getScheduleData
  });

  // Custom hook para manejar el estado local de horarios
  const {
    schedules,
    originalSchedule,
    updateOpenSchedule,
    updateCloseSchedule,
    error,
    setError,
    days
  } = useScheduleStateModify(backendSchedules);

  // useMutation para manejar la actualización de horarios (PATCH)
  const saveSchedulesMutation = useMutation({
    mutationFn: () => modifySchedulesToBackend(schedules, originalSchedule.current!),
    onSuccess: () => {
      // Invalidar query para refrescar datos del backend
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setError(""); // Limpiar errores  

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/Admin/Horarios');
      }, 2000);
    },
    onError: (err: Error) => {
      setError(`Error al actualizar los horarios: ${err.message}`);
    }
  });

  // Función handleSaveAll que usa la mutation
  const handleSaveAll = () => {
    saveSchedulesMutation.mutate();
  };

  if (queryLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ color: "#561d03" }}>
          Cargando horarios...
        </Typography>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          border: 3, 
          borderColor: "#c1280f",
          borderTop: 3,
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" }
          }
        }} />
      </Box>
    );
  }

  if (queryError) {
    return (
      <Box sx={{ width: "80%", mx: "auto", mt: 5 }}>
        <Alert severity="error">
          Error al cargar horarios: {queryError.message}
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
        <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
          Gestión de Horarios - Modificar
        </Typography>
        <BackButton></BackButton>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ 
          bgcolor: "#e9ddc2", 
          borderRadius: 3,
          '& .MuiTabs-scrollButtons': {
            color: "#561d03",
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#c1280f'
          }
        }}
      >
        {days.map((day, index) => (
          <Tab
            key={index}
            label={day.label}
            sx={{
              color: tab === index ? "#c1280f" : "#561d03",
              fontWeight: "bold",
              minWidth: { xs: "7rem" },
              fontSize: { xs: "1rem"},
              px: { xs: 1, sm: 2 }
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 3, p: 3, borderRadius: 3, border: 2, borderColor: "#000000ff", bgcolor: "#e9ddc2"}}>
        <Typography variant="h6" sx={{ mb: 2, color: "#561d03" }}>
          {days[tab].label}
        </Typography>
      
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
      
        <TextField
          label="Apertura"
          type="time"
          fullWidth
          value={ schedules[tab].horaApertura }
          onChange={(e) => updateOpenSchedule(tab, e.target.value)}
          sx={{ mb: 2, bgcolor: "#fff" }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          label="Cierre"
          type="time"
          fullWidth
          value={ schedules[tab].horaCierre }
          onChange={(e) => updateCloseSchedule(tab, e.target.value)}
          sx={{ mb: 2, bgcolor: "#fff" }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Box>

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
            bgcolor: "#b12e1aff",
            "&:hover": { bgcolor: "#561d03" },
            borderRadius: 2,
            minWidth: "120px",
            flex: 1,
            maxWidth: "200px",
          }}
        >
          {saveSchedulesMutation.isSuccess && (
            <CircularProgress 
              size={20} 
              sx={{ 
                color: "white", 
                marginRight: 1 
              }} 
            />
          )}
          {saveSchedulesMutation.isSuccess ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
      <SuccessNotification activation={ saveSchedulesMutation.isSuccess }></SuccessNotification>
    </Box>
  );
}

/* 
Debuger
  <Typography sx={{ mt: 2, p: 2, bgcolor: "#f0f0f0", borderRadius: 2 }}>
    <strong>Debug Info:</strong><br />
    <strong>useQuery:</strong><br />
    isLoading: {queryLoading ? 'true' : 'false'}<br />
    isError: {queryError ? 'true' : 'false'}<br />
    error: {queryError ? String(queryError) : 'null'}<br />
    data: {backendSchedules ? JSON.stringify(backendSchedules, null, 2) : 'null'}<br />
    <strong>useScheduleState:</strong><br />
    schedules[{tab}]: {schedules[tab] ? JSON.stringify(schedules[tab], null, 2) : 'null'}<br />
    total schedules: {schedules.length}<br />
    <strong>useMutation:</strong><br />
    isPending: {saveSchedulesMutation.isPending ? 'true' : 'false'}<br />
    isError: {saveSchedulesMutation.isError ? 'true' : 'false'}<br />
    isSuccess: {saveSchedulesMutation.isSuccess ? 'true' : 'false'}<br />
    error: {saveSchedulesMutation.error ? String(saveSchedulesMutation.error) : 'null'}
  </Typography> */
