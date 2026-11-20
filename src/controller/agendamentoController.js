
import {
  criarAgendamento,
  listarAgendamentosPorBarbeiro,
  listarAgendamentosPorCliente,
  atualizarStatusAgendamento,
  listarServicos,
  listarBarbeiros,
  cancelarAgendamentoPorCliente
} from "../model/agendamentoModel.js";

// CRIAR AGENDAMENTO
export async function cadastrarAgendamento(req, res) {
  try {
    const {
      id_cliente,
      id_barbeiro,
      id_servico,
      data_hora,
      observacao
    } = req.body;

    if (!id_cliente || !id_barbeiro || !id_servico || !data_hora) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatorios."
      });
    }

    const agendamento = await criarAgendamento({
      id_cliente,
      id_barbeiro,
      id_servico,
      data_hora,
      observacao
    });

    return res.status(201).json({
      mensagem: "Agendamento criado com sucesso!",
      agendamento
    });
  } catch (erro) {
    console.error("Erro ao criar agendamento:", erro);

    return res.status(500).json({
      mensagem: erro.message || "Erro ao criar agendamento."
    });
  }
}

// LISTAR AGENDAMENTOS DO BARBEIRO
export async function buscarAgendamentosBarbeiro(req, res) {
  try {
    const { id_barbeiro } = req.params;

    const agendamentos =
      await listarAgendamentosPorBarbeiro(id_barbeiro);

    return res.status(200).json(agendamentos);
  } catch (erro) {
    console.error("Erro ao buscar agendamentos do barbeiro:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar agendamentos."
    });
  }
}

// LISTAR AGENDAMENTOS DO CLIENTE
export async function buscarAgendamentosCliente(req, res) {
  try {
    const { id_cliente } = req.params;

    const agendamentos =
      await listarAgendamentosPorCliente(id_cliente);

    return res.status(200).json(agendamentos);
  } catch (erro) {
    console.error("Erro ao buscar agendamentos do cliente:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar agendamentos."
    });
  }
}

// ATUALIZAR STATUS DO AGENDAMENTO
export async function mudarStatusAgendamento(req, res) {
  try {
    const { id_agendamento } = req.params;
    const { id_barbeiro, status } = req.body;

    const statusPermitidos = [
      "Confirmado",
      "Recusado",
      "Concluído",
      "Cancelado"
    ];

    if (!id_barbeiro || !statusPermitidos.includes(status)) {
      return res.status(400).json({
        mensagem: "Barbeiro ou status invalido."
      });
    }

    const agendamento = await atualizarStatusAgendamento(
      id_agendamento,
      id_barbeiro,
      status
    );

    if (!agendamento) {
      return res.status(404).json({
        mensagem: "Agendamento nao encontrado."
      });
    }

    return res.status(200).json({
      mensagem: "Status atualizado com sucesso!",
      agendamento
    });
  } catch (erro) {
    console.error("Erro ao atualizar status:", erro);

    return res.status(500).json({
      mensagem: "Erro ao atualizar status do agendamento."
    });
  }
}

// LISTAR SERVICOS
export async function buscarServicos(req, res) {
  try {
    const servicos = await listarServicos();
    return res.status(200).json(servicos);
  } catch (erro) {
    console.error("Erro ao buscar servicos:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar servicos."
    });
  }
}

// LISTAR BARBEIROS
export async function buscarBarbeiros(req, res) {
  try {
    const barbeiros = await listarBarbeiros();
    return res.status(200).json(barbeiros);
  } catch (erro) {
    console.error("Erro ao buscar barbeiros:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar barbeiros."
    });
  }
}

// CANCELAR AGENDAMENTO PELO CLIENTE
export async function cancelarAgendamentoCliente(req, res) {
  try {
    const { id_agendamento } = req.params;
    const { id_cliente } = req.body;

    if (!id_cliente) {
      return res.status(400).json({
        mensagem: "Cliente não identificado."
      });
    }

    const agendamento = await cancelarAgendamentoPorCliente(
      id_agendamento,
      id_cliente
    );

    if (!agendamento) {
      return res.status(404).json({
        mensagem: "Agendamento não encontrado ou não pode ser cancelado."
      });
    }

    return res.status(200).json({
      mensagem: "Agendamento cancelado com sucesso!",
      agendamento
    });
  } catch (erro) {
    console.error("Erro ao cancelar agendamento:", erro);

    return res.status(500).json({
      mensagem: "Erro ao cancelar agendamento."
    });
  }
}