import { Box, Typography, List, ListItem } from "@mui/material"; 
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import EmailIcon from '@mui/icons-material/Email'; 
import PhoneIcon from '@mui/icons-material/Phone'; 
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import ScheduleIcon from '@mui/icons-material/Schedule'; 
import FastfoodIcon from '@mui/icons-material/Fastfood'; 
import { NavLink } from "react-router";

// --- Links de navegación para el sector cocina ---
const navLinks = [
  { label: "Panel Principal", path: "/Cocina", icon: <DashboardIcon sx={{ fontSize: 16, mr: 0.5 }} />, end: true },
  { label: "Sugerencias", path: "/Cocina/Sugerencias", icon: <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />, end: true },
  { label: "Pedidos", path: "/Cocina/Pedidos", icon: <FastfoodIcon sx={{ fontSize: 16, mr: 0.5 }} />, end: true },
];

export default function KitchenFooter() {
  const currentYear = new Date().getFullYear();
  const restaurantName = "Tu Restaurante";

  return (
    <Box
      component="footer"
      className="shadow-2xl border-t-4 border-amber-500"
      sx={{
        backgroundColor: "#222222", 
        color: "#E0E0E0",
        py: { xs: 6, md: 8 },
        px: { xs: 4, md: 8 },
        width: "100%",
        textAlign: "center",
        mt: { xs: 6, md: 10 },
      }}
    >
      <Box 
        className="max-w-6xl mx-auto"
        sx={{
          display: 'grid',
          gap: { xs: 5, md: 4 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          textAlign: { xs: 'center', md: 'left' },
          mb: 4,
        }}
      >
        {/* --- Sección descripción --- */}
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 2, color: '#FFC107' }}>
            {restaurantName}
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, color: '#B0B0B0' }} className="leading-relaxed">
            Plataforma de cocina diseñada para optimizar la gestión de pedidos y la sugerencias de platos. Facilita la coordinación de tu equipo en la cocina y mejora la eficiencia diaria.
          </Typography>
        </Box>

        {/* --- Sección navegación --- */}
        <Box>
          <Typography variant="subtitle1" component="p" sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF' }} className="uppercase tracking-wider">
            Navegación
          </Typography>
          <List sx={{ p: 0 }} className="space-y-1">
            {navLinks.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ py: 0, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    color: isActive ? '#FFC107' : '#B0B0B0',
                    textDecoration: isActive ? 'underline' : 'none',
                    transition: 'color 0.2s ease',
                  })}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* --- Sección contacto y legal --- */}
        <Box>
          <Typography variant="subtitle1" component="p" sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF' }} className="uppercase tracking-wider">
            Contacto & Legal
          </Typography>
          
          <Box sx={{ color: '#B0B0B0' }} className="space-y-2">
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <EmailIcon sx={{ fontSize: 16, mr: 1 }} className="text-amber-400" />
                cocina@turestaurante.com
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <PhoneIcon sx={{ fontSize: 16, mr: 1 }} className="text-amber-400" />
                (54) 11 5555-COOK
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, flexWrap: 'wrap', mt: 3 }}>
              <NavLink
                  to="#"
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: isActive ? '#FFC107' : '#B0B0B0',
                    textDecoration: isActive ? 'underline' : 'none',
                    transition: 'color 0.2s ease',
                  })}
              >
                  <PolicyIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  Política de Privacidad
              </NavLink>
              <NavLink
                  to="#"
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: isActive ? '#FFC107' : '#B0B0B0',
                    textDecoration: isActive ? 'underline' : 'none',
                    transition: 'color 0.2s ease',
                  })}
              >
                  <GavelIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  Términos y Condiciones
              </NavLink>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: '1px', bgcolor: '#333', mx: 'auto', my: { xs: 3, md: 4 } }} />

      <Typography variant="caption" display="block" sx={{ color: '#909090', fontSize: '0.75rem' }}>
        © {currentYear} {restaurantName}. Todos los derechos reservados. Desarrollado por C-R-I-S para la gestión de restaurantes.
      </Typography>
    </Box>
  );
}
