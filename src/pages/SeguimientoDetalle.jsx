import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/client";

const documentosAdjuntos = [
  { tipo: "Cédula de identidad", archivo: "CI.pdf" },
  { tipo: "Informe Biomédico Funcional", archivo: "informe-biomedico.pdf" },
  { tipo: "Informe Social y Redes de Apoyo", archivo: "informe-social-redes-de-apoyo.pdf" },
  { tipo: "IVADEC", archivo: "IVADEC.pdf" },
  { tipo: "Antecedentes", archivo: "ANTECEDENTE.pdf" },
];

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
      return "En ingreso";
    case "REVISION":
      return "En revisión";
    case "CALIFICACION":
      return "En calificación";
    case "CORRECCION":
      return "En corrección";
    case "DERIVACION":
      return "En espera de derivación";
    default:
      return etapaApi;
  }
};

const SeguimientoDetalle = () => {
  const { id } = useParams(); // id de solicitud
  const navigate = useNavigate();
  const { user, isSuper } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [solicitud, setSolicitud] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioActual, setFuncionarioActual] = useState(null);

  const [nuevoAsignado, setNuevoAsignado] = useState("");
  const [motivoCorreccion, setMotivoCorreccion] = useState("");
  const [mostrarMotivo, setMostrarMotivo] = useState(false); 

  // -------- 1. Cargar datos desde la API --------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const solRes = await api.get(`/solicitud/${id}`);
        const solicitudData = solRes.data;

        const [usrRes, funcRes] = await Promise.all([
          api.get("/usuarios"),
          api.get("/funcionarios"),
        ]);

        const usuarios = usrRes.data;
        const funcs = funcRes.data;

        const usuarioSolicitud = usuarios.find(
          (u) => u.id_usuario === solicitudData.id_usuario
        );

        const funcAsignado = funcs.find(
          (f) => f.id_funcionario === solicitudData.asignado_a
        );

        setSolicitud(solicitudData);
        setUsuario(usuarioSolicitud || null);
        setFuncionarios(funcs);
        setFuncionarioActual(funcAsignado || null);

        if (funcAsignado) {
          setNuevoAsignado(String(funcAsignado.id_funcionario));
        }
      } catch (err) {
        console.error("Error cargando detalle de solicitud", err);
        setError(
          err.response?.status
            ? `Error ${err.response.status}: ${err.response.statusText}`
            : err.message || "Error al cargar la solicitud"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // -------- 2. Guardar asignación / derivación (solo super) --------

  const handleMostrarMotivo = () => {
  setMostrarMotivo(true);
};
  const handleGuardarAsignacion = async () => {
  if (!isSuper) {
    alert("No tienes permisos para asignar o derivar solicitudes.");
    return;
  }

  // nuevoAsignado puede ser "", null o un id
  const asignadoId =
    nuevoAsignado === "" || nuevoAsignado == null
      ? null
      : Number(nuevoAsignado);

  try {
    await api.patch(`/solicitud/${id}/asignar`, {
      asignado_a: asignadoId,
      // 👇 MUY IMPORTANTE: quién hizo la acción
      id_funcionario_actor: user.id_funcionario,
    });

    const funcNuevo =
      asignadoId == null
        ? null
        : funcionarios.find((f) => f.id_funcionario === asignadoId) || null;

    setSolicitud((prev) =>
      prev
        ? { ...prev, asignado_a: asignadoId }
        : prev
    );
    setFuncionarioActual(funcNuevo);

    alert("Asignación/derivación guardada correctamente.");
  } catch (err) {
    console.error("Error al guardar asignación", err);
    alert("No se pudo guardar la asignación.");
  }
};


  // -------- 3. Devolver a corrección (para quien revisa) --------
  const handleDevolverCorreccion = async () => {
  if (!motivoCorreccion.trim()) {
    alert("Ingresa un motivo de corrección.");
    return;
  }

  try {
    await api.patch(`/solicitud/${id}/devolver`, {
      motivo: motivoCorreccion,
      id_funcionario_actor: user.id_funcionario,  // 👈 aquí
    });

    setSolicitud((prev) =>
      prev
        ? { ...prev, etapa: "CORRECCION", asignado_a: null }
        : prev
    );
    setFuncionarioActual(null);

    alert("Solicitud devuelta al usuario para corrección.");
    setMotivoCorreccion("");
    setMostrarMotivo(false);
  } catch (err) {
    console.error("Error al devolver a corrección", err);
    alert("No se pudo devolver la solicitud.");
  }
};


  // -------- 4. Aprobar revisión --------
  const handleAprobarRevision = async () => {
    if (!solicitud) return;
    try {
      await api.patch(`/solicitud/${id}/aprobar-revision`, {
        id_funcionario: user.id_funcionario,
      });

      alert("Solicitud aprobada y enviada a 'En espera de Derivación'");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error al aprobar la solicitud");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Cargando detalle de la solicitud...</Typography>
      </Container>
    );
  }

  if (error || !solicitud) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">
          {error || "Solicitud no encontrada"}
        </Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Container>
    );
  }
const handleClickDevolver = () => {
  // Primer click: solo mostrar el cuadro
  if (!mostrarMotivo) {
    setMostrarMotivo(true);
    return;
  }

  // Segundo click (ya visible): intentar devolver
  handleDevolverCorreccion();
};
  const etapaLabel = mapEtapaFromApi(solicitud.etapa);
  const estadoLabel = mapEstadoFromApi(solicitud.estado);

  const estaEnRevisionYAsignada =
    solicitud.etapa === "REVISION" &&
    solicitud.asignado_a === user.id_funcionario;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Solicitud ID {solicitud.id_solicitud}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip label={estadoLabel} color="primary" sx={{ mr: 1 }} />
          <Chip label={etapaLabel} color="secondary" />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* DATOS DEL USUARIO */}
        <Typography variant="h6" gutterBottom>
          Datos del usuario
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="RUT"
              value={usuario?.rut || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre completo"
              value={
                usuario
                  ? `${usuario.nombres} ${usuario.apellidos}`
                  : "Sin información"
              }
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha nacimiento"
              value={
                usuario?.fecha_nacimiento
                  ? new Date(usuario.fecha_nacimiento).toLocaleDateString(
                      "es-CL"
                    )
                  : ""
              }
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Edad declarada"
              value={usuario?.edad_declarada || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Género"
              value={usuario?.sexo || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              value={usuario?.telefono || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Correo"
              value={usuario?.correo || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              value={usuario?.direccion || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Comuna"
              value={usuario?.comuna || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Región"
              value={usuario?.region || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* DOCUMENTOS ADJUNTOS */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Documentos adjuntos
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tipo de documento</TableCell>
                <TableCell>Archivo</TableCell>
                <TableCell align="right">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentosAdjuntos.map((doc) => (
                <TableRow key={doc.archivo}>
                  <TableCell>{doc.tipo}</TableCell>
                  <TableCell>{doc.archivo}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      component="a"
                      href={`/docs/${doc.archivo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

       {/* REVISIÓN: aprobar o devolver (solo cuando está en REVISION y asignada a este analista)*/}
{estaEnRevisionYAsignada && (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" gutterBottom>
      Revisión de solicitud
    </Typography>

    {/* Botones uno debajo del otro, mismo ancho */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        mb: 2,
      }}
    >
      <Button
        variant="contained"
        color="success"
        onClick={handleAprobarRevision}
        sx={{ width: 260 }}
      >
        APROBAR SOLICITUD
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={handleMostrarMotivo}   // 👈 solo muestra el cuadro
        sx={{ width: 260 }}
      >
        DEVOLVER A CORRECCIÓN
      </Button>
    </Box>

    {/* Cuadro + botón de confirmación solo si se pidió devolver */}
    {mostrarMotivo && (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Motivo de corrección"
          value={motivoCorreccion}
          onChange={(e) => setMotivoCorreccion(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />

        <Button
          variant="contained"
          color="primary"      // 👈 azul con letra blanca
          sx={{ alignSelf: "flex-start" }}
          onClick={handleDevolverCorreccion}
        >
          DEVOLVER
        </Button>
      </Box>
    )}
  </Box>
)}



        <Divider sx={{ my: 2 }} />

        {/* ASIGNACIÓN / DERIVACIÓN */}
        <Typography variant="h6" gutterBottom>
          Asignación y derivación
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Asignado actualmente a"
              value={funcionarioActual?.nombre_completo || "Sin asignar"}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {isSuper && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Reasignar / derivar a"
                  value={nuevoAsignado}
                  onChange={(e) => setNuevoAsignado(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">Sin asignación</MenuItem>
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

              <Grid item xs={12}>
                <Button variant="contained" onClick={handleGuardarAsignacion}>
                  Guardar asignación
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SeguimientoDetalle;
