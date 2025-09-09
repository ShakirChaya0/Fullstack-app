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
import HomeIcon from './HomeIcon';

// Links de navegación
const navLinks = [
  { label: 'Novedades', path: '/Admin/Novedades' },
  { label: 'Datos Restaurante', path: '/Admin/DatosRestaurantes' },
];

// Componente para cada link de navegación
const NavLinkItem = ({ to, label }: { to: string; label: string }) => (
  <Typography variant="h6" component="div">
    <NavLink
      to={to}
      style={({ isActive }) => ({
        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
        textDecoration: "none",
        fontWeight: isActive ? "bold" as const : "normal",
        borderBottom: isActive ? "2px solid #fff" : "none",
        paddingBottom: "2px",
        transition: "all 0.2s ease",
      })}
    >
      {label}
    </NavLink>
  </Typography>
);

export default function AdminHeader() {
  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  return (
    <AppBar position="static" sx={{ bgcolor: "#222222", height: "4rem" }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <IconButton sx={{ display: { xs: "none", md: "block" } }} color="inherit">
          <HomeIcon />
        </IconButton>

        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3, ml: 2 }}>
          {navLinks.map(link => (
            <NavLinkItem key={link.path} to={link.path} label={link.label} />
          ))}
        </Box>

        {auth && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Administrador
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </Box>
        )}

        {/* Componente que abre el menu de opciones en mobile. REVISAR */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {navLinks.map(link => (
                <ListItem  key={link.path} component={NavLink} to={link.path}>
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

