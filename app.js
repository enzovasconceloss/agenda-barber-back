
import express from "express";
import cors from "cors";

import clienteRoutes from "./routes/clienteRoutes.js";
import barbeiroRoutes from "./routes/barbeiroRoutes.js";
import agendamentoRoutes from "./routes/agendamentoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Agenda Barber funcionando!"
  });
});

app.use("/clientes", clienteRoutes);
app.use("/barbeiros", barbeiroRoutes);
app.use("/agendamentos", agendamentoRoutes);

export default app;
