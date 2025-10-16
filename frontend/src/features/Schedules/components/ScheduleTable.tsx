import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getDayLabel } from "../utils/getDayLabel";
import type { BackendSchedule } from "../types/scheduleTypes";


export function ScheduleTable ({ schedules }: { schedules: BackendSchedule[]}) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead 
                    sx={{
                        bgcolor: "#f3f4f6"
                    }}
                >
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>Día de la semana</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Hora de Apertura</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Hora de Cierre</TableCell>                                            
                    </TableRow>
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
    )
}