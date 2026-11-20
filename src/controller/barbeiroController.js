
import {
  buscarUsuarioPorEmail,
  buscarBarbeiroPorEmail,
  criarBarbeiro
} from "../model/barbeiroModel.js";

import bcrypt from "bcrypt";

// CADASTRAR BARBEIRO
export async function cadastrarBarbeiro(req, res) {
  try {
    const { nome, email, telefone, senha, especialidade } = req.body;

    if (!nome || !email || !senha || !especialidade) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios."
      });
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    const barbeiro = await criarBarbeiro({
      nome,
      email,
      telefone,
      senha,
      especialidade
    });

    return res.status(201).json({
      mensagem: "Barbeiro cadastrado com sucesso!",
      barbeiro
    });

  } catch (erro) {
    console.error("Erro ao cadastrar barbeiro:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar barbeiro."
    });
  }
}

// LOGIN BARBEIRO
export async function loginBarbeiro(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e a senha."
      });
    }

    const barbeiro = await buscarBarbeiroPorEmail(email);

    if (!barbeiro) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      barbeiro.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      barbeiro: {
        id_usuario: barbeiro.id_usuario,
        nome: barbeiro.nome,
        email: barbeiro.email,
        telefone: barbeiro.telefone,
        especialidade: barbeiro.especialidade
      }
    });

  } catch (erro) {
    console.error("Erro no login do barbeiro:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao realizar login."
    });
  }
}

// CRUD: outras operações serão implementadas depois
function emDesenvolvimento(req, res) {
  return res.status(501).json({
    mensagem: "Funcionalidade ainda não implementada."
  });
}

export const listarBarbeiros = emDesenvolvimento;
export const buscarBarbeiro = emDesenvolvimento;
export const atualizarBarbeiro = emDesenvolvimento;
export const excluirBarbeiro = emDesenvolvimento;
