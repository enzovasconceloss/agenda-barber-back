
import pool from "../config/db.js";

// CRIAR AGENDAMENTO
export async function criarAgendamento(dados) {
  const {
    id_cliente,
    id_barbeiro,
    id_servico,
    data_hora,
    observacao
  } = dados;

  const conexao = await pool.connect();

  try {
    await conexao.query("BEGIN");

    const servico = await conexao.query(
      `SELECT id_servico
       FROM servico
       WHERE id_servico = $1`,
      [id_servico]
    );

    if (servico.rowCount === 0) {
      throw new Error("Serviço não encontrado.");
    }

    const resultado = await conexao.query(
      `INSERT INTO agendamento
        (id_cliente, id_barbeiro, data_hora, status, observacao)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        id_cliente,
        id_barbeiro,
        data_hora,
        "Pendente",
        observacao || null
      ]
    );

    const agendamento = resultado.rows[0];

    await conexao.query(
      `INSERT INTO agendamento_servico
        (id_agendamento, id_servico)
       VALUES ($1, $2)`,
      [agendamento.id_agendamento, id_servico]
    );

    await conexao.query("COMMIT");

    return agendamento;
  } catch (erro) {
    await conexao.query("ROLLBACK");
    throw erro;
  } finally {
    conexao.release();
  }
}

// LISTAR AGENDAMENTOS DO BARBEIRO
export async function listarAgendamentosPorBarbeiro(id_barbeiro) {
  const resultado = await pool.query(
    `SELECT
       a.id_agendamento,
       a.id_cliente,
       a.id_barbeiro,
       a.data_hora,
       a.status,
       a.observacao,
       c.nome AS cliente_nome,
       STRING_AGG(s.nome, ', ' ORDER BY s.nome) AS servico_nome,
       SUM(s.duracao_minutos)::integer AS duracao,
       SUM(s.preco)::numeric AS preco
     FROM agendamento a
     INNER JOIN cliente cl
       ON cl.id_usuario = a.id_cliente
     INNER JOIN usuario c
       ON c.id_usuario = cl.id_usuario
     LEFT JOIN agendamento_servico ags
       ON ags.id_agendamento = a.id_agendamento
     LEFT JOIN servico s
       ON s.id_servico = ags.id_servico
     WHERE a.id_barbeiro = $1
     GROUP BY
       a.id_agendamento,
       c.nome
     ORDER BY a.data_hora`,
    [id_barbeiro]
  );

  return resultado.rows;
}

// LISTAR AGENDAMENTOS DO CLIENTE
export async function listarAgendamentosPorCliente(id_cliente) {
  const resultado = await pool.query(
    `SELECT
       a.id_agendamento,
       a.id_cliente,
       a.id_barbeiro,
       a.data_hora,
       a.status,
       a.observacao,
       b.nome AS barbeiro_nome,
       STRING_AGG(s.nome, ', ' ORDER BY s.nome) AS servico_nome,
       SUM(s.duracao_minutos)::integer AS duracao,
       SUM(s.preco)::numeric AS preco
     FROM agendamento a
     INNER JOIN barbeiro bar
       ON bar.id_usuario = a.id_barbeiro
     INNER JOIN usuario b
       ON b.id_usuario = bar.id_usuario
     LEFT JOIN agendamento_servico ags
       ON ags.id_agendamento = a.id_agendamento
     LEFT JOIN servico s
       ON s.id_servico = ags.id_servico
     WHERE a.id_cliente = $1
     GROUP BY
       a.id_agendamento,
       b.nome
     ORDER BY a.data_hora`,
    [id_cliente]
  );

  return resultado.rows;
}

// ATUALIZAR STATUS PELO BARBEIRO
export async function atualizarStatusAgendamento(
  id_agendamento,
  id_barbeiro,
  status
) {
  const resultado = await pool.query(
    `UPDATE agendamento
     SET status = $1
     WHERE id_agendamento = $2
       AND id_barbeiro = $3
     RETURNING *`,
    [status, id_agendamento, id_barbeiro]
  );

  return resultado.rows[0];
}


// LISTAR SERVIÇOS DISPONÍVEIS
export async function listarServicos() {
  const resultado = await pool.query(
    `SELECT
       id_servico AS id,
       nome,
       descricao,
       duracao_minutos AS duracao,
       preco
     FROM servico
     ORDER BY id_servico`
  );

  return resultado.rows;
}

// LISTAR BARBEIROS DISPONÍVEIS
export async function listarBarbeiros() {
  const resultado = await pool.query(
    `SELECT
       u.id_usuario AS id,
       u.nome,
       b.especialidade
     FROM barbeiro b
     INNER JOIN usuario u
       ON u.id_usuario = b.id_usuario
     ORDER BY u.nome`
  );

  return resultado.rows;
}

// CANCELAR AGENDAMENTO PELO CLIENTE
export async function cancelarAgendamentoPorCliente(
  id_agendamento,
  id_cliente
) {
  const resultado = await pool.query(
    `UPDATE agendamento
     SET status = $1
     WHERE id_agendamento = $2
       AND id_cliente = $3
       AND status IN ($4, $5)
     RETURNING *`,
    [
      "Cancelado",
      id_agendamento,
      id_cliente,
      "Pendente",
      "Confirmado"
    ]
  );

  return resultado.rows[0];
}