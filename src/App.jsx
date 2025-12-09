import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Toolbar } from "@mui/material";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Seguimiento from "./pages/Seguimiento";
import SeguimientoDetalle from "./pages/SeguimientoDetalle"; // ← nuevo
import Configuracion from "./pages/Configuracion";
import Ayuda from "./pages/Ayuda";
import Revision from "./pages/Revision"; // ⬅️ AÑADIR ESTA LÍNEA
import { useAuth } from "./contexts/AuthContext";
import PruebaAPI from "./pages/PruebaAPI";
import Bitacora from "./pages/Bitacora";


function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Login />;

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal a la derecha */}
      <div style={{ flexGrow: 1 }}>
        {/* Topbar fija arriba */}
        <Topbar />

        {/* Espaciador para evitar solapamiento con AppBar */}
        <Toolbar />

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/seguimiento/:id" element={<SeguimientoDetalle />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/bitacora" element={<Bitacora />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/ayuda" element={<Ayuda />} />
          <Route path="/prueba-api" element={<PruebaAPI />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
