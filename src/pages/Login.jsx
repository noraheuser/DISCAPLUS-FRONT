import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();   // 👈 para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { rut, password });
      const user = res.data;

      login(user);     // guarda en contexto, agregamos esSuper automáticamente en el AuthContext
      navigate("/");   // 👈 redirige a Home después de loguear
    } catch (err) {
      console.error(err);
      setError("RUT o contraseña incorrectos");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="RUT"
          fullWidth
          margin="normal"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
