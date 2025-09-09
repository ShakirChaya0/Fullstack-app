import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router";

export function ClientFooter() {
  const location = useLocation();
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 4,
        mt: "auto",
        mb: location.pathname.includes("/Menu/") ? { xs: "85px", md: 0 } : 0,
        width: "100%",
        backgroundColor: "#333",
        color: "#fff",
        textAlign: "center"
      }}
    >
      <Typography variant="body1" gutterBottom>
        Seguinos en redes:
      </Typography>
      <Box>
        {/* OCUPAN 7.4 MB, HAY QUE ENCONTRAR UNA ALTERNATIVA
        <IconButton href="#" color="inherit">
          <Facebook />
        </IconButton>
        <IconButton href="#" color="inherit">
          <Instagram />
        </IconButton>
        <IconButton href="#" color="inherit">
          <Twitter />
        </IconButton>
        */}
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        © {new Date().getFullYear()} Tu Restaurante
      </Typography>
    </Box>
  );
}