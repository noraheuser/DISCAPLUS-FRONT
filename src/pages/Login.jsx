import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Usuario"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Contraseña"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth type="submit" variant="contained" color="primary">
          Entrar
        </Button>
      </form>
    </Container>
  );
};

export default Login;
