// src/pages/Bitacora.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";

const Bitacora = () => {
  const { isSuper } = useAuth();

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filtros
  const [filtroSolicitud, setFiltroSolicitud] = useState("");
  const [filtroFuncionario, setFiltroFuncionario] = useState("");
  const [filtroAccion, setFiltroAccion] = useState("");

  // lista de funcionarios para el selector
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [bitRes, funcRes] = await Promise.all([
          api.get("/bitacora"),
          api.get("/funcionarios"),
        ]);

        const funcs = funcRes.data;
        setFuncionarios(funcs);

        const mapeados = bitRes.data.map((e) => {
          const func = e.funcionario || funcs.find(
            (f) => f.id_funcionario === e.id_funcionario
          );

          return {
            id: e.id_evento,
            idSolicitud: e.id_solicitud,
            accion: e.accion,
            observaciones: e.observaciones || "",
            fecha: e.fecha_evento,
            idFuncionario: e.id_funcionario,
            nombreFuncionario: func?.nombre_completo || "—",
          };
        });

        setEventos(mapeados);
      } catch (err) {
        console.error("Error cargando bitácora", err);
        setError(
          err.response?.status
            ? `Error ${err.response.status}: ${err.response.statusText}`
            : err.message || "Error al cargar bitácora"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!isSuper) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography color="error">
          No tienes permisos para ver la bitácora.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography>Cargando bitácora…</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  // opciones únicas de acciones
  const accionesUnicas = Array.from(new Set(eventos.map((e) => e.accion)));

  const eventosFiltrados = eventos.filter((e) => {
    const cumpleSolicitud =
      !filtroSolicitud ||
      String(e.idSolicitud).includes(String(filtroSolicitud).trim());

    const cumpleFuncionario =
      !filtroFuncionario || e.idFuncionario === Number(filtroFuncionario);

    const cumpleAccion =
      !filtroAccion || e.accion === filtroAccion;

    return cumpleSolicitud && cumpleFuncionario && cumpleAccion;
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bitácora de acciones
        </Typography>
        <Typography variant="body2" gutterBottom>
          Registro automático de movimientos y derivaciones realizados en el sistema.
        </Typography>

        {/* Filtros */}
        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="ID solicitud"
              value={filtroSolicitud}
              onChange={(e) => setFiltroSolicitud(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              select
              label="Funcionario"
              value={filtroFuncionario}
              onChange={(e) => setFiltroFuncionario(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Todos</MenuItem>
              {funcionarios.map((f) => (
                <MenuItem
                  key={f.id_funcionario}
                  value={String(f.id_funcionario)}
                >
                  {f.nombre_completo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              select
              label="Acción"
              value={filtroAccion}
              onChange={(e) => setFiltroAccion(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Todas</MenuItem>
              {accionesUnicas.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Tabla */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID evento</TableCell>
                <TableCell>ID solicitud</TableCell>
                <TableCell>Funcionario</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Observaciones</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventosFiltrados.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.idSolicitud}</TableCell>
                  <TableCell>{e.nombreFuncionario}</TableCell>
                  <TableCell>{e.accion}</TableCell>
                  <TableCell>{e.observaciones}</TableCell>
                  <TableCell>
                    {e.fecha &&
                      new Date(e.fecha).toLocaleString("es-CL")}
                  </TableCell>
                </TableRow>
              ))}
              {eventosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2">
                      No se encontraron registros con los filtros aplicados.
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

export default Bitacora;
