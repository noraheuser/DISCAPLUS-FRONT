// src/pages/Revision.jsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";

// Mismas funciones de Seguimiento para mostrar bonito
const mapEstadoFromApi = (estadoApi) => {
  switch (estadoApi) {
    case "EN_CURSO":
      return "En curso";
    case "COMPLETADO":
      return "Completado";
    case "RECHAZADO":
      return "Rechazado";
    default:
      return estadoApi;
  }
};

const mapEtapaFromApi = (etapaApi) => {
  switch (etapaApi) {
    case "INGRESO":
      return "En Ingreso";
    case "REVISION":
      return "En Revisión";
    case "CALIFICACION":
      return "En Calificación";
    case "CORRECCION":
      return "En Corrección";
    case "DERIVACION":
      return "En espera de Derivación";
    default:
      return etapaApi;
  }
};

const Revision = () => {
  const { user } = useAuth(); // 👈 aquí tomamos analista logueado
  const navigate = useNavigate();

  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarTramites = async () => {
      try {
        setLoading(true);

        // 1) Pedimos las solicitudes ASIGNADAS a este funcionario
        const [solRes, usrRes] = await Promise.all([
          api.get(`/solicitud/asignadas/${user.id_funcionario}`),
          api.get("/usuarios"),
        ]);

        const solicitudes = solRes.data;
        const usuarios = usrRes.data;

        // 🔹 1) Filtrar solo las solicitudes en etapa REVISION
        const soloRevision = solicitudes.filter((s) => s.etapa === "REVISION");

        // 🔹 2) Armamos los datos para la tabla SOLO con esas
        const mapeados = soloRevision.map((s) => {
          const usuario = usuarios.find(
            (u) => u.id_usuario === s.id_usuario
         );

      return {
        id: s.id_solicitud,
        rut: usuario?.rut ?? "",
        nombre:
          usuario?.nombres && usuario?.apellidos
            ? `${usuario.nombres} ${usuario.apellidos}`
            : usuario?.nombres || "",
        estado: mapEstadoFromApi(s.estado),
        etapa: mapEtapaFromApi(s.etapa), // aquí ya se convierte a "En Revisión"
        fechaCreacion: s.fecha_ingreso,
      };
    });

setTramites(mapeados);
      } catch (err) {
        console.error("Error cargando trámites de revisión", err);
        setError(
          err.response?.status
            ? `Error ${err.response.status}: ${err.response.statusText}`
            : err.message || "Error al cargar los trámites de revisión"
        );
      } finally {
        setLoading(false);
      }
    };

    cargarTramites();
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Cargando trámites asignados...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bandeja de Revisión
        </Typography>
        <Typography variant="body2" gutterBottom>
          Aquí ves solo los trámites asignados a:{" "}
          <strong>{user.nombre}</strong>
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Etapa</TableCell>
                <TableCell>Creación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tramites.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.rut}</TableCell>
                  <TableCell>{t.nombre}</TableCell>
                  <TableCell>{t.estado}</TableCell>
                  <TableCell>{t.etapa}</TableCell>
                  <TableCell>
                    {t.fechaCreacion &&
                      new Date(t.fechaCreacion).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(`/seguimiento/${t.id}`, { state: { tramite: t } })
                      }
                    >
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {tramites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center">
                      No tienes trámites asignados por ahora.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Revision;
