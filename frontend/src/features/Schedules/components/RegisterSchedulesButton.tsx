import { Button } from "@mui/material";
import { Link } from "react-router";
import type { BackendSchedule } from "../types/scheduleTypes";
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
                bgcolor: "#0F766E",
                "&:hover": { bgcolor: "#0F766E" },
                borderRadius: 2,
                minWidth: "120px",
                flex: 1,
                maxWidth: "200px",
                textAlign: "center"
            }}
        >
            <span className="text-lg font-bold mb-1 mr-1"><AddCircleIcon fontSize="small"/></span>
            Registrar Horarios
        </Button>
    )
}