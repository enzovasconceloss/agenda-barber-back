import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

app.get("/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");

    res.json({
      mensagem: "PostgreSQL conectado com sucesso!",
      horario: resultado.rows[0].now
    });
  } catch (erro) {
    console.error("Erro no PostgreSQL:", erro);

    res.status(500).json({
      mensagem: "Erro ao conectar com PostgreSQL"
    });
  }
});

app.post("/clientes", (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  res.status(201).json({
    mensagem: "Cadastro realizado com sucesso!"
  });
});

export default app;