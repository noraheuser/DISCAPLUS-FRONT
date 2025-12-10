// src/components/Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HistoryIcon from "@mui/icons-material/History";

import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 240;

const Sidebar = () => {
  const { isSuper } = useAuth();

  const itemSx = {
    color: "inherit",
    "& .MuiListItemIcon-root": {
      color: "inherit",
      minWidth: 40,
    },
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background:
            "linear-gradient(180deg, #003c6f 0%, #005c97 40%, #007bb2 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Toolbar />

      {/* Contenedor para separar menú principal y menú inferior */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Menú principal (arriba) */}
        <List>
          {/* Inicio */}
          <ListItemButton component={Link} to="/" sx={itemSx}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>

          {/* Seguimiento */}
          <ListItemButton component={Link} to="/seguimiento" sx={itemSx}>
            <ListItemIcon>
              <TrackChangesIcon />
            </ListItemIcon>
            <ListItemText primary="Seguimiento" />
          </ListItemButton>

          {/* Revisión */}
          <ListItemButton component={Link} to="/revision" sx={itemSx}>
            <ListItemIcon>
              <FactCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Revisión" />
          </ListItemButton>

          {/* Bitácora – solo perfiles súper */}
          {isSuper && (
            <ListItemButton component={Link} to="/bitacora" sx={itemSx}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Bitácora" />
            </ListItemButton>
          )}
        </List>

        {/* Menú inferior (abajo) */}
        <Box>
          <Divider
            sx={{
              my: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          />

          <List>
            {/* Configuración */}
            <ListItemButton component={Link} to="/configuracion" sx={itemSx}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItemButton>

            {/* Ayuda */}
            <ListItemButton component={Link} to="/ayuda" sx={itemSx}>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Ayuda" />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
