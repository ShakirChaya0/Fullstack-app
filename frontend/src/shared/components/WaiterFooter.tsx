import { Box, Typography, Link, List, ListItem } from "@mui/material"; 
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export function WaiterFooter() {
  const currentYear = new Date().getFullYear();
  const restaurantName = "Tu Restaurante";

  const quickLinks = [
    { label: "Reserva del Día", url: "/ReservaDelDia/", icon: <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
    { label: "Mesas del Restaurante", url: "/MesasDelRestaurante/", icon: <TableRestaurantIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
    { label: "Mesas Disponibles", url: "/MesasDisponibles", icon: <EventSeatIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
  ];

  return (
    <Box
      component="footer"
      className="shadow-2xl border-t-4 border-amber-500"
      sx={{
        backgroundColor: "#222222", 
        color: "#E0E0E0",
        py: { xs: 5, md: 6 },
        px: { xs: 4, md: 8 },
        width: "100%",
        textAlign: "center",
      }}
    >
      <Box 
        className="max-w-4xl mx-auto"
        sx={{
          display: 'grid',
          gap: { xs: 4, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          textAlign: { xs: 'center', md: 'left' },
          mb: 3,
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
            Sistema de gestión para meseros. Visualiza tus mesas, reservas y disponibilidad de manera rápida y sencilla.
          </Typography>
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
      </Box>

      <Box sx={{ 
        width: '100%', 
        height: '1px', 
        bgcolor: '#333', 
        mx: 'auto', 
        my: { xs: 3, md: 4 } 
      }} />

      <Typography variant="caption" display="block" sx={{ color: '#909090', fontSize: '0.75rem' }}>
        © {currentYear} {restaurantName}. Sistema para meseros — desarrollado con ❤️ para facilitar tu trabajo.
      </Typography>
    </Box>
  );
}
