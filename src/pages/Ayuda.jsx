// src/pages/Ayuda.jsx
import React from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Ayuda = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Ayuda y soporte
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Aquí encontrarás una guía rápida para el uso del sistema y la
          información de contacto para soporte.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* MANUAL RÁPIDO */}
        <Typography variant="h6" gutterBottom>
          Guía rápida de uso
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="1. Revisión de solicitudes" secondary="Ingresa a la pestaña 'Revisión', selecciona un caso, revisa los documentos adjuntos y aprueba o devuelve según corresponda." />
          </ListItem>
          <ListItem>
            <ListItemText primary="2. Aprobar solicitud" secondary="Al aprobar una solicitud en revisión, esta pasa automáticamente a la etapa 'En espera de derivación' para ser asignada posteriormente a un analista evaluador." />
          </ListItem>
          <ListItem>
            <ListItemText primary="3. Devolver para corrección" secondary="Si falta documentación o hay errores, utiliza la opción 'Devolver a corrección' indicando el motivo. La solicitud regresa a la bandeja del usuario para que pueda corregirla." />
          </ListItem>
          <ListItem>
            <ListItemText primary="4. Seguimiento general" secondary="En la pestaña 'Seguimiento' puedes buscar y filtrar solicitudes por RUT, etapa, analista asignado y fechas." />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* PREGUNTAS FRECUENTES */}
        <Typography variant="h6" gutterBottom>
          Preguntas frecuentes
        </Typography>

        <Typography variant="subtitle2">
          ¿Qué significa &quot;En espera de derivación&quot;?
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          La solicitud fue revisada y se encuentra pendiente de asignación a un
          analista evaluador para la etapa de calificación.
        </Typography>

        <Typography variant="subtitle2">
          ¿Quién puede aprobar o devolver una solicitud?
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Solo el funcionario al que está asignada la solicitud en etapa
          &quot;En revisión&quot; puede aprobarla o devolverla para corrección.
        </Typography>

        <Typography variant="subtitle2">
          ¿Puedo editar los datos del usuario solicitante?
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          No. Los datos personales provienen del sistema de ingreso y solo
          pueden corregirse desde la fuente original del trámite.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* CONTACTO */}
        <Typography variant="h6" gutterBottom>
          Contacto de soporte
        </Typography>
        <Typography variant="body2">
          Para incidencias técnicas o dudas sobre el uso del sistema:
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          📧 soporte.discapacidad@seremi.gob.cl
        </Typography>
        <Typography variant="body2">
          ☎️ Mesa de ayuda interno 1234 (horario hábil)
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 2 }}
        >
          Esta es una versión prototipo del sistema, desarrollada con fines
          académicos. Algunos módulos se encuentran en construcción.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Ayuda;
