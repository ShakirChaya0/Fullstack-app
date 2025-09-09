import {
    Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper,
    Box,
    Typography,
    Alert,
    Button
} from "@mui/material";
import { getScheduleData } from "../shared/sheduleService";
import { useQuery } from "@tanstack/react-query";
import { days, sortAndNormalizeSchedules } from "../hooks/useScheduleState";
import { Link } from "react-router";
import { BackButton } from "../components/backButton";

function getDayLabel(dayIndex: number): string {
    const day = days.find(d => d.value === dayIndex);
    return day ? day.label : "Día desconocido";
}

export function MainPanelSchedules() {
    const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['schedules'],
        queryFn: getScheduleData
    });

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

    const schedules = backendSchedules ? sortAndNormalizeSchedules(backendSchedules) : []

    return (
        <>
            <Box sx={{ 
                width: { xs: "95%", sm: "90%", md: "80%" }, 
                mx: "auto", 
                mt: 4,
                mb: 4
            }}>
                {
                    schedules.length === 0 ? 
                    (
                        <Alert severity="info">
                            No hay horarios disponibles.
                        </Alert>
                    ) :
                    (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                                    Gestión de Horarios
                                </Typography>
                                <BackButton></BackButton>
                            </Box>
                            <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead 
                                            sx={{
                                                bgcolor: "#e9ddc2"
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>Día de la semana</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Hora de Apertura</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Hora de Cierre</TableCell>                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {schedules.map((eachShedule) => (
                                                <TableRow key={eachShedule.diaSemana}>
                                                    <TableCell component="th" scope="row">   
                                                    <Box
                                                        sx={{
                                                            marginLeft: {sm: "2rem"}
                                                        }}
                                                    >
                                                        {getDayLabel(eachShedule.diaSemana)}
                                                    </Box>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '1rem' }}>{eachShedule.horaApertura}</TableCell>
                                                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '1rem' }}>{eachShedule.horaCierre}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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
                    <Button
                        component={Link}
                        to="/Admin/Horarios/modificar"
                        variant="contained"
                        disabled={schedules.length === 0 ? true : false}
                        sx={{
                            bgcolor: "#b12e1aff",
                            "&:hover": { bgcolor: "#561d03" },
                            borderRadius: 2,
                            minWidth: "120px",
                            flex: 1,
                            maxWidth: "200px",
                        }}
                    >
                    Modificar Horarios
                    </Button>
                    <Button
                        component={Link}
                        to="/Admin/Horarios/modificar"
                        variant="contained"
                        disabled={schedules.length === 0 ? false : true}
                        sx={{
                            bgcolor: "#b12e1aff",
                            "&:hover": { bgcolor: "#561d03" },
                            borderRadius: 2,
                            minWidth: "120px",
                            flex: 1,
                            maxWidth: "200px",
                        }}
                    >
                    Registrar Horarios
                    </Button>
                </Box>
            </Box>
        </>
    )
}