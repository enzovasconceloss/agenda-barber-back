
import {
  buscarClientePorEmail,
  criarCliente
} from "../model/clienteModel.js";

import bcrypt from "bcrypt";

// CADASTRAR CLIENTE
export async function cadastrarCliente(req, res) {
  try {
    const { nome, email, telefone, senha, data_nascimento } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, e-mail e senha são obrigatórios."
      });
    }

    const clienteExistente = await buscarClientePorEmail(email);

    if (clienteExistente) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    const cliente = await criarCliente({
      nome,
      email,
      telefone,
      senha,
      data_nascimento
    });

    return res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso!",
      cliente
    });

  } catch (erro) {
    console.error("Erro ao cadastrar cliente:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar cliente."
    });
  }
}

// LOGIN CLIENTE
export async function loginCliente(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e a senha."
      });
    }

    const cliente = await buscarClientePorEmail(email);

    if (!cliente) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      cliente.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      cliente: {
        id_usuario: cliente.id_usuario,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone
      }
    });

  } catch (erro) {
    console.error("Erro no login:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao realizar login."
    });
  }
}

// CRUD: manteremos para a etapa combinada.
function emDesenvolvimento(req, res) {
  return res.status(501).json({
    mensagem: "Funcionalidade ainda não implementada."
  });
}

export const listarClientes = emDesenvolvimento;
export const buscarCliente = emDesenvolvimento;
export const atualizarCliente = emDesenvolvimento;
export const excluirCliente = emDesenvolvimento;
