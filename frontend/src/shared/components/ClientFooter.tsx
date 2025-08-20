import { Box, Typography, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

export function ClientFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 4,
        mt: "auto",
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