const bitacoraMock = {
  TRM001: [
    {
      fecha: "2025-10-01 10:00",
      usuario: "Nora Heuser",
      accion: "Creación del trámite",
      tipo: "create",
    },
    {
      fecha: "2025-10-02 15:30",
      usuario: "Carlos Soto",
      accion: "Cambio de etapa: Ingreso → En revisión",
      tipo: "update",
    },
  ],
  TRM002: [
    {
      fecha: "2025-10-03 11:45",
      usuario: "Ana López",
      accion: "Observaciones agregadas",
      tipo: "comment",
    },
  ],
};

export default bitacoraMock;
