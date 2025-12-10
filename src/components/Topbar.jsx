// src/components/Topbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import { useAuth } from "../contexts/AuthContext";

const Topbar = () => {
  const { user, logout, isSuper } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
  };

  const nombreMostrar =
    user?.nombre_completo ||
    user?.nombre ||
    user?.username ||
    "Usuario";

  const rolMostrar = isSuper ? "Perfil Super" : user?.rol || "Analista";

  const iniciales = nombreMostrar
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background:
          "linear-gradient(90deg, #003c6f 0%, #005c97 40%, #007bb2 100%)",
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        {/* Título a la izquierda */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Sistema de Trámites
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, color: "#e0f7ff" }}>
            Gestión de solicitudes de discapacidad – Discaplus
          </Typography>
        </Box>

        {/* Pastilla de usuario a la derecha */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Cuenta">
            <Box
              onClick={handleOpenMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.0,
                px: 2.6,          // más padding horizontal
                py: 0.8,          // un poquito más alto
                minWidth: 160,    // 👈 clave: ancho mínimo de la pastilla
                justifyContent: "space-between", // separa texto y avatar
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.35)",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                backdropFilter: "blur(4px)",
                          }}
            >
              {/* Nombre + rol dentro de la pastilla */}
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1.1,
                  }}
                >
                  {nombreMostrar}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#b3e5ff",
                    fontWeight: 500,
                    lineHeight: 1.1,
                  }}
                >
                  {rolMostrar}
                </Typography>
              </Box>

              {/* Avatar con iniciales, también dentro de la pastilla */}
              {iniciales ? (
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "rgba(0,0,0,0.18)",
                    fontSize: 14,
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  {iniciales}
                </Avatar>
              ) : (
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "rgba(0,0,0,0.18)",
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
            </Box>
          </Tooltip>

          {/* Menú de la cuenta */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {nombreMostrar}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {rolMostrar}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
