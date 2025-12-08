import { Container, Typography, Paper } from "@mui/material";

export default function Inicio() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido/a al Sistema de Trámites COMPIN
        </Typography>

        <Typography variant="h6" gutterBottom>
          Gestión digital para certificaciones de discapacidad
        </Typography>

        <Typography variant="body1">
          Desde este sistema podrás realizar seguimiento de trámites, revisar
          solicitudes, asignar solicitudes y consultar información relevante del
          proceso de certificación.
        </Typography>
      </Paper>
    </Container>
  );
}
