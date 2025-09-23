import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingProductPrice () {
    return (
        <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: "center",
        minHeight: '200px',
        width: "100%",
        mt: 4
        }}>
        <CircularProgress 
            size={40} 
            sx={{ 
            color: "#c1280f", 
            marginRight: 1 
            }} 
        />
        <Typography variant="h6" sx={{ color: "#561d03" }}>
            Cargando Productos...
        </Typography>
        </Box>
    );
}