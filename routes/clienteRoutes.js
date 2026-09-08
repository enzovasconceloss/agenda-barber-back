import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    mensagem: "Rota de clientes funcionando!"
  });
});

router.post("/", (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos!"
    });
  }

  console.log("Dados recebidos do Front-End:");
  console.log("Nome:", nome);
  console.log("Email:", email);
  console.log("Telefone:", telefone);

  return res.status(201).json({
    mensagem: "Cadastro realizado com sucesso!"
  });
});

export default router;