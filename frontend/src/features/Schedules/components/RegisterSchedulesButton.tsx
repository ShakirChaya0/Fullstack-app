import { Button } from "@mui/material";
import { Link } from "react-router";
import type { BackendSchedule } from "../types/scheduleTypes";


export function RegisterSchedulesButton ({ schedules }: { schedules: BackendSchedule[]}) {
    
    if (schedules.length > 0) return null;
    
    return (
        <Button
            component={Link}
            to="/Admin/Horarios/registrar"
            variant="contained"
            disabled={schedules.length === 0 ? false : true}
            sx={{
                textTransform: "none",
                bgcolor: "#b12e1aff",
                "&:hover": { bgcolor: "#561d03" },
                borderRadius: 2,
                minWidth: "120px",
                flex: 1,
                maxWidth: "200px",
                textAlign: "center"
            }}
        >
            Registrar Horarios
        </Button>
    )
}