import express from "express";
import clienteController from "../controller/clienteController.js";

const router = express.Router();


// Buscar todos os clientes
router.get("/", clienteController.getAll);


// Buscar cliente por ID
router.get("/:id", clienteController.getById);


// Cadastrar cliente
router.post("/", clienteController.create);


// Atualizar cliente
router.put("/:id", clienteController.update);


// Excluir cliente
router.delete("/:id", clienteController.remove);


export default router;