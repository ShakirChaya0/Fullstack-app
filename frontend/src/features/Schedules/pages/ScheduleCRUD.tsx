import { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useScheduleState, type BackendSchedule } from "../hooks/useScheduleState";

const getScheduleData = async () => {
  const response = await fetch('http://localhost:3000/horarios/', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Función para guardar horarios en el backend
const saveSchedulesToBackend = async (schedules: BackendSchedule[], originalSchedules: BackendSchedule[]) => {
    // Validar todos los horarios completados
    let validSchedule = true
    schedules.forEach(oneSchedule => {
        if(!oneSchedule.horaApertura || !oneSchedule.horaCierre) validSchedule = false
    });

    if(!validSchedule) throw new Error("Horarios incompletos");

    //Ejecutar modificación solo en aquellos horarios que fueron modificados
    const modifiedSchedules = schedules.filter((schedule, index) => {
      const original = originalSchedules[index];
      return schedule.horaApertura !== original.horaApertura || schedule.horaCierre !== original.horaCierre;
    });

    if (modifiedSchedules.length === 0) {
      // No hay cambios, no es necesario hacer ninguna petición
      return [];
    }

    // Requests paralelos usando Promise.all
    const promises = modifiedSchedules.map(schedule => 
      fetch(`http://localhost:3000/horarios/update/${schedule.diaSemana}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiJlNTM0YjUyMS1iNzEwLTRhNjQtOGUyOC1iMTZkMTY5ZDVlYjQiLCJlbWFpbCI6InBlcGVAZ21haWwuY29tIiwidGlwb1VzdWFyaW8iOiJBZG1pbmlzdHJhZG9yIiwidXNlcm5hbWUiOiJQZXBlUm9kcmlndWV6MTIzIiwiaWF0IjoxNzU3MjA3Mzc5LCJleHAiOjE3NTc4MTIxNzl9.VxPW6Jkjg4Nm7CeVj-6PD8g6-JJCg3b8T3d8eK_E_dY' 
          // Hardcodeando el jwt, CAMBIAR
        },
        body: JSON.stringify(schedule)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
    );

    // Ejecutar todas las requests en paralelo
    return Promise.all(promises);
};

export function ScheduleCRUD() {
  const [tab, setTab] = useState(0);
  const queryClient = useQueryClient();
  
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
  } = useScheduleState(backendSchedules);

  // useMutation para manejar la actualización de horarios (PATCH)
  const saveSchedulesMutation = useMutation({
    mutationFn: () => saveSchedulesToBackend(schedules, originalSchedule.current!),
    onSuccess: (data) => {
      console.log("Horarios guardados exitosamente:", data);
      // Invalidar query para refrescar datos del backend
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setError(""); // Limpiar errores
      // Opcional: mostrar mensaje de éxito
    },
    onError: (err: Error) => {
      console.error("Error al guardar horarios:", err);
      setError(`Error al guardar los horarios: ${err.message}`);
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
      mt: 5 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
          Gestión de Horarios
        </Typography>
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
        justifyContent="space-between"
        alignItems="center"
        marginTop="1rem"
        marginX="1rem"
        gap={2}
      >
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          sx={{
            bgcolor: "#8f8888ff",
            "&:hover": { 
              bgcolor: "#000000ff",
              width: { xs: "auto", sm: "auto" },
              minWidth: "120px",
              "& .button-text": {
                opacity: 1,
                width: "auto"
              }
            },
            borderRadius: 2,
            width: "48px", 
            minWidth: "48px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
            transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: "8px 12px"
          }}
        >
          <ArrowBackIcon 
            sx={{ 
              fontSize: "1.2rem",
              flexShrink: 0 
            }} 
          />
          <Box
            className="button-text"
            sx={{
              opacity: 0,
              width: 0,
              marginLeft: "0.75rem",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
          >
            Volver
          </Box>
        </Button>
    
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
          {saveSchedulesMutation.isPending ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
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
      </Typography>
    </Box>
  );
}
