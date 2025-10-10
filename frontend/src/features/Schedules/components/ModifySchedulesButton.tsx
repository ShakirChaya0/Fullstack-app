import { Button } from "@mui/material";
import { Link } from "react-router";
import type { BackendSchedule } from "../types/scheduleTypes";

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
            Modificar Horarios
        </Button>
    )
}