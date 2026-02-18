import { Button } from "@mui/material";
import { Link } from "react-router";
import type { BackendSchedule } from "../types/scheduleTypes";
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export function ModifySchedulesButton ({ schedules }: { schedules: BackendSchedule[]}) {
    return (
        <Button
            component={Link}
            to="/Admin/Horarios/modificar"
            variant="contained"
            disabled={schedules.length === 0 ? true : false}
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
            <span className="flex-shrink-0 mb-1 mr-1"><ModeEditIcon fontSize="small"/></span>
            Modificar Horarios
        </Button>
    )
}