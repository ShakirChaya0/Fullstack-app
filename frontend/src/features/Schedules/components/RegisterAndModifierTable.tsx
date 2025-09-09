import { Box, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { days } from "../constants/scheduleConstants";
import type { RegisterAndModifierTableProps } from "../types/scheduleTypes";

export function RegisterAndModifierTable ({ schedules, updateOpenSchedule, updateCloseSchedule }: RegisterAndModifierTableProps) {
    const [tab, setTab] = useState(0);

    return (
        <>
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
        </>
    )
}