// Seguimiento.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";

import { ESTADOS_TRAMITE, ETAPAS_TRAMITE } from "../constants/tramiteOptions";
// ❌ Ya no usamos UNIDADES aquí
// import { UNIDADES } from "../constants/unidades";

import api from "../api/client";

// ---------- utilidades ----------

const normalizarRut = (rutStr) => {
  if (!rutStr) return null;
  const limpio = rutStr.replace(/[^\dkK]/g, "");
  if (limpio.length < 2) return null;
  const cuerpo = limpio.slice(0, -1);
  const num = parseInt(cuerpo, 10);
  return isNaN(num) ? null : num;
};

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

// genera lista única de “Asignado a”
const obtenerAsignadosUnicos = (tramites) => {
  const nombres = tramites
    .map((t) => t.asignadoA)
    .filter((n) => n && n.trim() !== "");
  return Array.from(new Set(nombres)); // elimina duplicados
};

const Seguimiento = () => {
  const [rutDesde, setRutDesde] = useState("");
  const [rutHasta, setRutHasta] = useState("");

  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("");
  const [etapa, setEtapa] = useState("");
  const [asignadoA, setAsignadoA] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [tramites, setTramites] = useState([]);
  const [asignadosUnicos, setAsignadosUnicos] = useState([]);
  const [derivaciones, setDerivaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [solRes, usrRes, funcRes, derivRes] = await Promise.all([
          api.get("/solicitud"),
          api.get("/usuarios"),
          api.get("/funcionarios"),
          api.get("/derivacion"),
        ]);
        setDerivaciones(derivRes.data); 

        const solicitudes = solRes.data;
        const usuarios = usrRes.data;
        const funcionarios = funcRes.data;

        const mapeados = solicitudes.map((s) => {
          const usuario = usuarios.find(
            (u) => u.id_usuario === s.id_usuario
          );
          const funcionario = funcionarios.find(
            (f) => f.id_funcionario === s.asignado_a
          );
          const derivacion = derivaciones.find(
            (d) => d.id_derivacion === s.id_derivacion
          );
          const etapaTexto = mapEtapaFromApi(s.etapa);

          return {
            id: s.id_solicitud,
            rut: usuario?.rut ?? "",
            nombres: usuario?.nombres ?? "",
            apellidos: usuario?.apellidos ?? "",
            nombre:
              usuario?.nombres && usuario?.apellidos
                ? `${usuario.nombres} ${usuario.apellidos}`
                : "",
            estado: mapEstadoFromApi(s.estado),
             etapa: etapaTexto,
            // 👇 SI está "En espera de derivación", mostramos vacío aunque la BD tenga algo
            // 👉 Dos campos separados
            asignadoA: funcionario?.nombre_completo || "",
            derivadoA: derivacion?.nombre || "",

            fechaCreacion: s.fecha_ingreso,
          };
          });

        setTramites(mapeados);
        setAsignadosUnicos(obtenerAsignadosUnicos(mapeados));
      } catch (err) {
        console.error("ERROR CARGANDO TRÁMITES", err);
        setError(
          err.response?.status
            ? `Error ${err.response.status}: ${err.response.statusText}`
            : err.message || "Error al cargar los trámites desde la API"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const limpiarFiltros = () => {
    setRutDesde("");
    setRutHasta("");
    setNombre("");
    setEstado("");
    setEtapa("");
    setAsignadoA("");
    setFechaDesde("");
    setFechaHasta("");
  };

  const renderEstadoChip = (estado) => {
    const color = estado === "En curso" ? "warning" : "success";
    return <Chip label={estado} color={color} variant="outlined" />;
  };

  const filtrarTramites = () => {
    const rutDesdeNum = normalizarRut(rutDesde);
    const rutHastaNum = normalizarRut(rutHasta);

    return tramites.filter((t) => {
      const rutTramiteNum = normalizarRut(t.rut);

      let cumpleRut = true;
      if (rutDesde || rutHasta) {
        if (rutTramiteNum == null) {
          cumpleRut = false;
        } else {
          if (rutDesdeNum != null && rutTramiteNum < rutDesdeNum) {
            cumpleRut = false;
          }
          if (rutHastaNum != null && rutTramiteNum > rutHastaNum) {
            cumpleRut = false;
          }
        }
      }

      const nombreCompleto =
        `${t.nombres || ""} ${t.apellidos || ""}`.trim() || t.nombre || "";

      const cumpleNombre =
        nombre === "" ||
        nombreCompleto.toLowerCase().includes(nombre.toLowerCase());

      const cumpleEstado = estado === "" || t.estado === estado;
      const cumpleEtapa = etapa === "" || t.etapa === etapa;
      const cumpleAsignado =
        asignadoA === "" ||
        t.asignadoA.toLowerCase().includes(asignadoA.toLowerCase());
      const cumpleDesde =
        fechaDesde === "" ||
        new Date(t.fechaCreacion) >= new Date(fechaDesde);
      const cumpleHasta =
        fechaHasta === "" ||
        new Date(t.fechaCreacion) <= new Date(fechaHasta);

      return (
        cumpleRut &&
        cumpleNombre &&
        cumpleEstado &&
        cumpleEtapa &&
        cumpleAsignado &&
        cumpleDesde &&
        cumpleHasta
      );
    });
  };

  const tramitesFiltrados = filtrarTramites();

  const obtenerDuplicados = () => {
    const mapa = {};
    tramitesFiltrados.forEach((t) => {
      if (!mapa[t.rut]) mapa[t.rut] = [];
      mapa[t.rut].push(t.id);
    });
    return Object.entries(mapa).reduce((acc, [rut, ids]) => {
      if (ids.length > 1) {
        ids.forEach((id) => {
          acc[id] = ids.filter((otroId) => otroId !== id);
        });
      }
      return acc;
    }, {});
  };

  const duplicadosPorId = obtenerDuplicados();

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography>Cargando trámites desde la API...</Typography>
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>
          Seguimiento de Trámites
        </Typography>
        <Typography variant="body2" gutterBottom>
          Por defecto, los resultados se limitan a una semana…
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="RUT desde"
              value={rutDesde}
              onChange={(e) => setRutDesde(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="RUT hasta"
              value={rutHasta}
              onChange={(e) => setRutHasta(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              fullWidth
            >
              {ESTADOS_TRAMITE.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Etapa"
              value={etapa}
              onChange={(e) => setEtapa(e.target.value)}
              fullWidth
            >
              {ETAPAS_TRAMITE.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Asignado a"
              value={asignadoA}
              onChange={(e) => setAsignadoA(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Todos</MenuItem>
              {asignadosUnicos.map((nombre) => (
                <MenuItem key={nombre} value={nombre}>
                  {nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Desde"
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Hasta"
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button variant="outlined" fullWidth onClick={limpiarFiltros}>
              Limpiar
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button variant="contained" fullWidth>
              Buscar
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Etapa</TableCell>
                <TableCell>Asignado a</TableCell>
                <TableCell>Derivado a</TableCell>
                <TableCell>Creación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tramitesFiltrados.map((t) => {
                const duplicado = duplicadosPorId[t.id];
                return (
                  <TableRow
                    key={t.id}
                    sx={duplicado ? { backgroundColor: "#fff3cd" } : {}}
                  >
                    <TableCell>{t.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {t.rut}
                        {duplicado && (
                          <Tooltip
                            title={`Duplicado con ID ${duplicado.join(", ")}`}
                          >
                            <WarningAmberIcon
                              sx={{ color: "#f57c00", ml: 1 }}
                              fontSize="small"
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {t.nombres && t.apellidos
                        ? `${t.nombres} ${t.apellidos}`
                        : t.nombre}
                    </TableCell>
                    <TableCell>{renderEstadoChip(t.estado)}</TableCell>
                    <TableCell>{t.etapa}</TableCell>
                    <TableCell>{t.asignadoA}</TableCell>
                    <TableCell>{t.derivadoA}</TableCell>    
                    
                    <TableCell>
                      {t.fechaCreacion &&
                        new Date(t.fechaCreacion).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver detalle">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/seguimiento/${t.id}`, { state: { tramite: t } })}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                    
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Seguimiento;
