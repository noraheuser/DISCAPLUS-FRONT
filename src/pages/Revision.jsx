import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  MenuItem,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CommentIcon from "@mui/icons-material/Comment";
import NotesIcon from "@mui/icons-material/Notes";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";

import tramitesMock from "../mocks/tramites";
import bitacoraMock from "../mocks/bitacora";
import observacionesMock from "../mocks/observaciones";
import documentosMock from "../mocks/documentos";
import { ETAPAS_TRAMITE } from "../constants/tramiteOptions";
import { UNIDADES } from "../constants/unidades";

const Revision = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tramite, setTramite] = useState(null);
  const [nuevaEtapa, setNuevaEtapa] = useState("");
  const [nuevoAsignado, setNuevoAsignado] = useState("");
  const [bitacora, setBitacora] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [nuevaObs, setNuevaObs] = useState("");
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    const idNum = Number(id); // 🔹 aseguramos número
    const encontrado = tramitesMock.find((t) => t.id === idNum);
    if (encontrado) {
      setTramite(encontrado);
      setNuevaEtapa(encontrado.etapa);
      setNuevoAsignado(encontrado.asignadoA || "sin-asignar");
      setBitacora(bitacoraMock[idNum] || []);
      setObservaciones(observacionesMock[idNum] || []);
      setDocumentos(documentosMock[idNum] || []);
    }
  }, [id]);

  const cambiarEtapa = () => {
    Swal.fire({
      icon: "success",
      title: "Etapa actualizada",
      text: `El trámite pasó a etapa: ${nuevaEtapa}`,
    });
  };

  const guardarReasignacion = () => {
    Swal.fire({
      icon: "info",
      title: "Trámite reasignado",
      text: `Nuevo responsable: ${nuevoAsignado}`,
    });
  };

  const guardarObservacion = () => {
    if (!nuevaObs.trim()) return;
    const nueva = {
      fecha: new Date().toLocaleString(),
      usuario: "Funcionario actual",
      texto: nuevaObs.trim(),
    };
    setObservaciones([nueva, ...observaciones]);
    setNuevaObs("");
    Swal.fire({
      icon: "success",
      title: "Observación agregada",
      text: "La observación fue guardada correctamente",
    });
  };

  const subirArchivoMock = () => {
    const nuevo = {
      nombre: "Nuevo documento cargado.pdf",
      estado: "Pendiente",
      fecha: new Date().toLocaleDateString(),
      tipo: "pdf",
    };
    setDocumentos([nuevo, ...documentos]);
    Swal.fire({
      icon: "success",
      title: "Archivo simulado",
      text: "Documento agregado exitosamente",
    });
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case "create":
        return <AddCircleOutlineIcon color="success" />;
      case "update":
        return <UpdateIcon color="primary" />;
      case "comment":
        return <CommentIcon color="action" />;
      default:
        return <UpdateIcon />;
    }
  };

  const getFileIcon = (tipo) => {
    if (tipo === "pdf") return <PictureAsPdfIcon color="error" />;
    if (tipo === "word") return <DescriptionIcon color="primary" />;
    return <UploadFileIcon />;
  };

  const exportToCSV = () => {
    const lines = [
      ["Trámite ID", tramite.id],
      ["Nombre", tramite.nombre],
      ["RUT", tramite.rut],
      ["Etapa", tramite.etapa],
      [],
      ["Observaciones"],
      ...observaciones.map((o) => [`${o.fecha} - ${o.usuario}`, o.texto]),
      [],
      ["Documentos"],
      ...documentos.map((d) => [d.nombre, d.estado, d.fecha]),
      [],
      ["Bitácora"],
      ...bitacora.map((b) => [`${b.fecha}`, `${b.usuario}: ${b.accion}`]),
    ];

    const csv = lines.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tramite.id}_detalle.csv`;
    a.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Trámite: ${tramite.nombre}`, 10, 10);
    doc.setFontSize(10);
    doc.text(`RUT: ${tramite.rut}`, 10, 18);
    doc.text(`Etapa: ${tramite.etapa}`, 10, 24);
    doc.text(`Asignado a: ${tramite.asignadoA}`, 10, 30);

    let y = 40;
    doc.setFontSize(12);
    doc.text("Observaciones:", 10, y);
    y += 6;

    observaciones.forEach((obs) => {
      doc.setFontSize(10);
      doc.text(`- ${obs.fecha} - ${obs.usuario}: ${obs.texto}`, 10, y);
      y += 6;
    });

    y += 4;
    doc.setFontSize(12);
    doc.text("Documentos:", 10, y);
    y += 6;

    documentos.forEach((docItem) => {
      doc.setFontSize(10);
      doc.text(
        `- ${docItem.nombre} (${docItem.estado}) - ${docItem.fecha}`,
        10,
        y
      );
      y += 6;
    });

    y += 4;
    doc.setFontSize(12);
    doc.text("Bitácora:", 10, y);
    y += 6;

    bitacora.forEach((b) => {
      doc.setFontSize(10);
      doc.text(`- ${b.fecha} - ${b.usuario}: ${b.accion}`, 10, y);
      y += 6;
    });

    doc.save(`${tramite.id}_detalle.pdf`);
  };

  if (!tramite) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6">Trámite no encontrado.</Typography>
        <Button onClick={() => navigate("/seguimiento")} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Revisión del Trámite
        </Typography>

        {/* Encabezado: nombre + RUT + estado */}
      {/* Encabezado: solo estado del trámite */}
    <Box sx={{ mb: 3 }}>
     <Chip
       label={tramite.estado}
       color={tramite.estado === "Completado" ? "success" : "warning"}
       />
    </Box>


        {/* 🔹 NUEVA SECCIÓN: DATOS DEL SOLICITANTE */}
     <Divider sx={{ my: 3 }} />
<Typography variant="h6" sx={{ mb: 2 }}>
  Datos del solicitante
</Typography>

<Grid container spacing={2} sx={{ mb: 2 }}>
  {/* 1. Nombres */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Nombres</Typography>
    <Typography variant="body1">
      {tramite.nombres || "-"}
    </Typography>
  </Grid>

  {/* 2. Apellidos */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Apellidos</Typography>
    <Typography variant="body1">
      {tramite.apellidos || "-"}
    </Typography>
  </Grid>

  {/* 3. RUT */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">RUT</Typography>
    <Typography variant="body1">
      {tramite.rut || "-"}
    </Typography>
  </Grid>

  {/* 4. Fecha de nacimiento */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Fecha de nacimiento</Typography>
    <Typography variant="body1">
      {tramite.fechaNacimiento || "-"}
    </Typography>
  </Grid>

  {/* 5. Edad */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Edad</Typography>
    <Typography variant="body1">
      {tramite.edad != null ? `${tramite.edad} años` : "-"}
    </Typography>
  </Grid>
 {/* 5. Género */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Género</Typography>
    <Typography variant="body1">
      {tramite.Sexo != null ? `${tramite.Sexo} ` : "-"}
    </Typography>
  </Grid>
  {/* 6. Dirección */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Dirección</Typography>
    <Typography variant="body1">
      {tramite.direccion || "-"}
    </Typography>
  </Grid>

  {/* 7. Comuna */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Comuna</Typography>
    <Typography variant="body1">
      {tramite.comuna || "-"}
    </Typography>
  </Grid>

  {/* 8. Correo electrónico */}
  <Grid item xs={12}>
    <Typography variant="subtitle2">Correo electrónico</Typography>
    <Typography variant="body1">
      {tramite.correo_electronico || tramite.correo_electronico || "-"}
    </Typography>
  </Grid>
</Grid>

        {/* RESTO DE TU LÓGICA TAL CUAL ESTABA */}

        <Divider sx={{ my: 4 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Etapa actual"
              value={tramite.etapa}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Nueva etapa"
              value={nuevaEtapa}
              onChange={(e) => setNuevaEtapa(e.target.value)}
              fullWidth
            >
              {ETAPAS_TRAMITE.map((e) => (
                <MenuItem key={e.value} value={e.value}>
                  {e.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={cambiarEtapa}>
          Actualizar etapa
        </Button>

        <Divider sx={{ my: 4 }} />
        <Typography variant="h6">Reasignación</Typography>
        <TextField
          select
          label="Nuevo responsable"
          value={nuevoAsignado}
          onChange={(e) => setNuevoAsignado(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        >
          {UNIDADES.map((u) => (
            <MenuItem key={u.value} value={u.label}>
              {u.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={guardarReasignacion}
        >
          Guardar reasignación
        </Button>

        <Divider sx={{ my: 4 }} />
        <Typography variant="h6">Documentos Adjuntos</Typography>
        <Button variant="outlined" sx={{ my: 2 }} onClick={subirArchivoMock}>
          Simular carga de archivo
        </Button>
        <List>
          {documentos.map((doc, index) => (
            <ListItem key={index}>
              <ListItemIcon>{getFileIcon(doc.tipo)}</ListItemIcon>
              <ListItemText
                primary={doc.nombre}
                secondary={`${doc.estado} — ${doc.fecha}`}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 4 }} />
        <Typography variant="h6">Observaciones Internas</Typography>
        <TextField
          label="Agregar observación"
          multiline
          minRows={3}
          fullWidth
          value={nuevaObs}
          onChange={(e) => setNuevaObs(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={guardarObservacion}>
          Guardar observación
        </Button>
        <List sx={{ mt: 2 }}>
          {observaciones.map((obs, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText
                primary={obs.texto}
                secondary={`${obs.usuario} — ${obs.fecha}`}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 4 }} />
        <Typography variant="h6">Bitácora del Trámite</Typography>
        <List>
          {bitacora.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>{getIcon(item.tipo)}</ListItemIcon>
              <ListItemText
                primary={item.accion}
                secondary={`${item.usuario} — ${item.fecha}`}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={exportToCSV}
            startIcon={<DownloadIcon />}
          >
            Exportar CSV
          </Button>
          <Button
            variant="outlined"
            onClick={exportToPDF}
            startIcon={<PictureAsPdfIcon />}
          >
            Exportar PDF
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button variant="text" onClick={() => navigate("/seguimiento")}>
            ← Volver al listado
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Revision;
