import {
    Box,
    Button
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router";

export function BackButton ({ url }: { url: string}) {
    return (
        <Button
            component={Link}
            to={url}
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
    )
}