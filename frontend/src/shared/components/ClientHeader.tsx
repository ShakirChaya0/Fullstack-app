import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from 'react-router';
import { ListItemButton } from '@mui/material';
import useAuth from '../hooks/useAuth';
import restauranteWhite from '../../shared/utils/assets/restauranteWhite.png' 

// Links de navegación para el cliente
const navLinks = [
  { label: 'Realizar Pedido', path: '/Cliente/Menu' },
];

// Componente para cada link de navegación, reutilizando los estilos del Admin
const NavLinkItem = ({ to, label }: { to: string; label: string }) => (
  <Typography variant="h6" component="div">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        relative pb-1 transition-all duration-300 
        ${isActive ? "text-white font-bold after:w-full after:left-0" : "text-white/70 font-normal after:w-0 after:left-1/2"}
        after:content-[''] after:absolute after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300
      `
      }
    >
      {label}
    </NavLink>
  </Typography>
);


//Este header se debe cambiar en el futuro la opción Realizar Pedido no va estar disponible al alcance de la nav Bar!!
export default function ClientHeader() {
  const { logout, user } = useAuth(); // Asume que useAuth funciona igual para cliente
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  return (
    <AppBar position="static" sx={{ bgcolor: "#222222", height: "4rem", marginBottom: '5rem'}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Botón menú hamburguesa en mobile (VISIBLE EN XS, a la izquierda) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            // Se oculta en desktop (md)
            sx={{ display: { xs: "block", md: "none", marginBottom: "0.5rem"} }} 
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Botón Home con Logo visible solo en desktop (VISIBLE EN MD) */}
          <NavLink to="/Cliente" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <IconButton 
              // Se oculta en mobile (xs)
              sx={{ display: { xs: "none", md: "block" } }} 
              color="inherit"
            >
              {/* Ajuste de tamaño del logo a 2rem para coincidir con el AdminHeader */}
              <img src={restauranteWhite} alt="Logo Restaurante" style={{ height: '2rem', width: 'auto' }} />
            </IconButton>
          </NavLink>

        </Box>

        {/* Links visibles en desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3, ml: 2 }}>
          {navLinks.map(link => (
            <NavLinkItem key={link.path} to={link.path} label={link.label} />
          ))}
        </Box>

        {/* Menú de usuario (SIEMPRE A LA DERECHA) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>
            {user?.username || 'Invitado'}
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            // Ajuste para el icono de perfil del cliente
            sx={{ p: 0 }}
          >
            {/* Icono de perfil de cliente, ajustado a 2rem para coincidir con el estilo del AdminHeader */}
            <AccountCircle sx={{ fontSize: '2rem' }} /> 
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <NavLink 
                to={"/Perfil"} 
                style={{ textDecoration: "none", color: "inherit", width: '100%' }}
              >
                Mi Perfil
              </NavLink>
            </MenuItem>
            <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Box>

        {/* Drawer (menú lateral en mobile) */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <div className='text-center py-4 font-bold'>
              <h1>Panel Cliente</h1>
            </div>
            <List>
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {({ isActive }) => (
                    <ListItem disablePadding>
                      <ListItemButton
                        disableRipple
                        sx={{
                          bgcolor: isActive ? "black" : "transparent",
                          color: isActive ? "white" : "inherit",
                          transition: "background-color 0.2s ease, color 0.2s ease",
                          "&:hover": {
                            bgcolor: isActive ? "grey.900" : "rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <ListItemText primary={link.label} />
                      </ListItemButton>
                    </ListItem>
                  )}
                </NavLink>
              ))}
              <ListItem disablePadding>
                <ListItemButton 
                    onClick={logout} 
                    sx={{ color: 'red', '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' } }}
                >
                    <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
            </ListItem>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
