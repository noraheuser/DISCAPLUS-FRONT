import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useAuth } from "../contexts/AuthContext";   // 👈 NUEVO

const drawerWidth = 240;

const Sidebar = () => {
  const { isSuper } = useAuth(); // 👈 saber si es Encargada

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Toolbar />
      <List>
        {/* Inicio */}
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItemButton>

        {/* Seguimiento */}
        <ListItemButton component={Link} to="/seguimiento">
          <ListItemIcon>
            <TrackChangesIcon />
          </ListItemIcon>
          <ListItemText primary="Seguimiento" />
        </ListItemButton>

        {/* Revisión */}
        <ListItemButton component={Link} to="/revision">
          <ListItemIcon>
            <FactCheckIcon />
          </ListItemIcon>
          <ListItemText primary="Revisión" />
        </ListItemButton>

        {/* 👉 Bitácora (solo Encargada / isSuper) */}
        {isSuper && (
          <ListItemButton component={Link} to="/bitacora">
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Bitácora" />
          </ListItemButton>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Configuración */}
        <ListItemButton component={Link} to="/configuracion">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </ListItemButton>

        {/* Ayuda */}
        <ListItemButton component={Link} to="/ayuda">
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Ayuda" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
