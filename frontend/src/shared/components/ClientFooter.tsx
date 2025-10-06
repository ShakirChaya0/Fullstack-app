import { Box, Typography, Link, IconButton, List, ListItem } from "@mui/material"; 
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/X';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import EmailIcon from '@mui/icons-material/Email'; 
import PhoneIcon from '@mui/icons-material/Phone'; 
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import ScheduleIcon from '@mui/icons-material/Schedule'; 
import FastfoodIcon from '@mui/icons-material/Fastfood'; 

export function ClientFooter() {
  const currentYear = new Date().getFullYear();
  const restaurantName = "Tu Restaurante";

  const socialLinks = [
    { name: "Facebook", icon: <FacebookIcon fontSize="small" />, url: "#" },
    { name: "Instagram", icon: <InstagramIcon fontSize="small" />, url: "#" },
    { name: "Twitter", icon: <TwitterIcon fontSize="small" />, url: "#" },
  ];

  const quickLinks = [
    { label: "Panel Principal", url: "/Admin", icon: <DashboardIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
    { label: "Horarios", url: "/Admin/Horarios", icon: <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
    { label: "Productos", url: "/Admin/Productos", icon: <FastfoodIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
  ];


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
        textAlign: "center"
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
        
        <Box>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ fontWeight: 700, mb: 2, color: '#FFC107' }}
          >
            {restaurantName}
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ mb: 2, color: '#B0B0B0' }}
            className="leading-relaxed"
          >
            Plataforma de administración para restaurantes y bares. Gestiona tu restaurante de manera eficiente con nosotros.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: { xs: 1, sm: 2 },
            mt: 2
          }}>
            {socialLinks.map((link) => (
              <IconButton 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`Seguinos en ${link.name}`}
                sx={{ 
                  color: '#E0E0E0', 
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#FFC107', 
                    bgcolor: 'rgba(255, 255, 255, 0.05)'
                  } 
                }}
              >
                {link.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography 
            variant="subtitle1" 
            component="p" 
            sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF' }}
            className="uppercase tracking-wider"
          >
            Navegación
          </Typography>
          <List sx={{ p: 0 }} className="space-y-1">
            {quickLinks.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ py: 0, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Link
                  href={item.url}
                  color="inherit"
                  underline="none"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontSize: '0.9rem', 
                    color: '#B0B0B0',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#FFC107', textDecoration: 'underline' }
                  }}
                  className="hover:translate-x-1 duration-200"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography 
            variant="subtitle1" 
            component="p" 
            sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF' }}
            className="uppercase tracking-wider"
          >
            Contacto & Legal
          </Typography>
          
          <Box sx={{ color: '#B0B0B0' }} className="space-y-2">
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <EmailIcon sx={{ fontSize: 16, mr: 1 }} className="text-amber-400" />
                admin@turestaurante.com
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <PhoneIcon sx={{ fontSize: 16, mr: 1 }} className="text-amber-400" />
                (54) 11 5555-ADMIN
            </Typography>
          </Box>

          <Box sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'center', md: 'flex-start' }, 
              gap: 2, 
              flexWrap: 'wrap',
              mt: 3 
          }}>
              <Link 
                  href="#" 
                  color="inherit" 
                  underline="none" 
                  sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#B0B0B0', '&:hover': { color: '#FFC107', textDecoration: 'underline' } }}
              >
                  <PolicyIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  Política de Privacidad
              </Link>
              <Link 
                  href="#" 
                  color="inherit" 
                  underline="none" 
                  sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#B0B0B0', '&:hover': { color: '#FFC107', textDecoration: 'underline' } }}
              >
                  <GavelIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  Términos y Condiciones
              </Link>
          </Box>
        </Box>
      </Box>

      <Box sx={{ 
        width: '100%', 
        height: '1px', 
        bgcolor: '#333', 
        mx: 'auto', 
        my: { xs: 3, md: 4 } 
      }} />

      <Typography variant="caption" display="block" sx={{ color: '#909090', fontSize: '0.75rem' }}>
        © {currentYear} {restaurantName}. Todos los derechos reservados. Desarrollado por C-R-I-S para la gestión de restaurantes
.
      </Typography>
    </Box>
  );
}
