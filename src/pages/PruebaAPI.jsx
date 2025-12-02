import React, { useEffect, useState } from "react";
import api from "../api/client";

const PruebaAPI = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/solicitud") // 👈 este es tu endpoint Nest
      .then((res) => {
        console.log("Datos desde la API:", res.data);
        setSolicitudes(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar solicitudes desde la API");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Prueba conexión API /solicitud</h1>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>id_solicitud</th>
            <th>id_usuario</th>
            <th>etapa</th>
            <th>estado</th>
            <th>asignado_a</th>
            <th>fecha_ingreso</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id_solicitud}>
              <td>{s.id_solicitud}</td>
              <td>{s.id_usuario}</td>
              <td>{s.etapa}</td>
              <td>{s.estado}</td>
              <td>{s.asignado_a}</td>
              <td>{s.fecha_ingreso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PruebaAPI;
