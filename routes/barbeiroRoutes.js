import express from "express";

import {
  cadastrarBarbeiro,
  loginBarbeiro,
  listarBarbeiros,
  buscarBarbeiro,
  atualizarBarbeiro,
  excluirBarbeiro
} from "../src/controller/barbeiroController.js";

const router = express.Router();

router.post("/", cadastrarBarbeiro);
router.post("/login", loginBarbeiro);
router.get("/", listarBarbeiros);
router.get("/:id", buscarBarbeiro);
router.put("/:id", atualizarBarbeiro);
router.delete("/:id", excluirBarbeiro);

export default router;