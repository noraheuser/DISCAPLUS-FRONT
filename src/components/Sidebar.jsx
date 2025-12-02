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
import EngineeringIcon from "@mui/icons-material/Engineering";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ApiIcon from "@mui/icons-material/Api";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

const drawerWidth = 240;

const Sidebar = () => {
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

        {/* Modelador */}
        <ListItemButton component={Link} to="/modelador">
          <ListItemIcon>
            <EngineeringIcon />
          </ListItemIcon>
          <ListItemText primary="Modelador" />
        </ListItemButton>

        {/* Seguimiento */}
        <ListItemButton component={Link} to="/seguimiento">
          <ListItemIcon>
            <TrackChangesIcon />
          </ListItemIcon>
          <ListItemText primary="Seguimiento" />
        </ListItemButton>

        {/* Revisión (misma ruta que seguimiento) */}
        <ListItemButton component={Link} to="/seguimiento">
          <ListItemIcon>
            <FactCheckIcon />
          </ListItemIcon>
          <ListItemText primary="Revisión" />
        </ListItemButton>

        {/* Gestión */}
        <ListItemButton component={Link} to="/gestion">
          <ListItemIcon>
            <ManageAccountsIcon />
          </ListItemIcon>
          <ListItemText primary="Gestión" />
        </ListItemButton>

        {/* Auditoría */}
        <ListItemButton component={Link} to="/auditoria">
          <ListItemIcon>
            <FactCheckIcon />
          </ListItemIcon>
          <ListItemText primary="Auditoría" />
        </ListItemButton>

        {/* API */}
        <ListItemButton component={Link} to="/api">
          <ListItemIcon>
            <ApiIcon />
          </ListItemIcon>
          <ListItemText primary="API" />
        </ListItemButton>

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
