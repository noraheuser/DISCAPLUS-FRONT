// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { rut, password });
      const user = res.data;

      // 👇 EXACTAMENTE igual que antes: respeta tus reglas de esSuper en AuthContext
      login(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("RUT o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #0d47a1 0%, #0b3a75 35%, #02101f 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
           elevation={0} // 👈 quitamos la sombra por defecto de MUI
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255,255,255,0.98)",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.35)", // 👈 sombra más marcada
              border: "1px solid rgba(255, 255, 255, 0.7)",  // borde sutil
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(13,71,161,0.08), rgba(255,255,255,0))",
                pointerEvents: "none",
              },
            }}
          >
          {/* Título */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Sistema de Trámites – Discaplus
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inicia sesión con tu RUT y contraseña de funcionario.
            </Typography>
          </Box>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="RUT"
              placeholder="17385131-6"
              fullWidth
              margin="normal"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: 1, mb: 1 }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !rut || !password}
              sx={{
                mt: 2,
                py: 1.1,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading ? "Ingresando…" : "Entrar"}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2, textAlign: "center" }}
            >
             Tu sesión determina el tipo de acceso: Perfiles con acceso ampliado pueden gestionar asignaciones y ver la bitácora. Perfiles estándar se enfocan en revisar y seguir solicitudes.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
