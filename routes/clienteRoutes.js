
import express from "express";

import {
  cadastrarCliente,
  loginCliente,
  listarClientes,
  buscarCliente,
  atualizarCliente,
  excluirCliente
} from "../src/controller/clienteController.js";

const router = express.Router();

// Cadastrar cliente
router.post("/", cadastrarCliente);

// Login do cliente
router.post("/login", loginCliente);

// Listar clientes
router.get("/", listarClientes);

// Buscar cliente por ID
router.get("/:id", buscarCliente);

// Atualizar cliente
router.put("/:id", atualizarCliente);

// Excluir cliente
router.delete("/:id", excluirCliente);

export default router;
