
import express from "express";

import {
  cadastrarAgendamento,
  buscarAgendamentosBarbeiro,
  buscarAgendamentosCliente,
  mudarStatusAgendamento,
  buscarServicos,
  buscarBarbeiros,
  cancelarAgendamentoCliente
} from "../src/controller/agendamentoController.js";

const router = express.Router();

// LISTAR SERVIÇOS
router.get("/servicos", buscarServicos);

// LISTAR BARBEIROS
router.get("/barbeiros", buscarBarbeiros);

// CRIAR AGENDAMENTO
router.post("/", cadastrarAgendamento);

// LISTAR AGENDAMENTOS DO BARBEIRO
router.get("/barbeiro/:id_barbeiro", buscarAgendamentosBarbeiro);

// LISTAR AGENDAMENTOS DO CLIENTE
router.get("/cliente/:id_cliente", buscarAgendamentosCliente);

// ATUALIZAR STATUS PELO BARBEIRO
router.patch("/:id_agendamento/status", mudarStatusAgendamento);

// CANCELAR AGENDAMENTO PELO CLIENTE
router.patch("/:id_agendamento/cancelar", cancelarAgendamentoCliente);

export default router;
