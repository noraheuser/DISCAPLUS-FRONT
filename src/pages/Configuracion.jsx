// src/pages/Configuracion.jsx
import React from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Configuracion = () => {
  const { user, logout } = useAuth(); // user viene del login (Analista_1, etc.)

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Configuración de cuenta
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Aquí puedes revisar los datos de tu perfil como funcionario y acceder
          a opciones básicas de cuenta.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* PERFIL DEL FUNCIONARIO */}
        <Typography variant="h6" gutterBottom>
          Perfil de funcionario
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre completo
            </Typography>
            <Typography>
              {user?.nombre_completo || "Funcionario/a sin nombre registrado"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              RUT
            </Typography>
            <Typography>{user?.rut || "-"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Correo institucional
            </Typography>
            <Typography>
              {user?.correo || "sin correo institucional"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Rol en el sistema
            </Typography>
            <Chip
              label={user?.rol || "SIN ROL"}
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* PREFERENCIAS / FUTURO */}
        <Typography variant="h6" gutterBottom>
          Preferencias
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          En futuras versiones podrás configurar notificaciones, preferencias
          de visualización y otros ajustes personales del sistema.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* INFO DEL SISTEMA */}
        <Typography variant="h6" gutterBottom>
          Información del sistema
        </Typography>
        <Typography variant="body2">
          Sistema de Gestión de Trámites de Certificación de Discapacidad
          – Unidad de Discapacidad COMPIN.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Versión 1.0 · Prototipo académico (INACAP – {new Date().getFullYear()})
        </Typography>

        {/* CERRAR SESIÓN */}
        <Button variant="outlined" color="error" onClick={logout}>
          Cerrar sesión
        </Button>
      </Paper>
    </Container>
  );
};

export default Configuracion;
