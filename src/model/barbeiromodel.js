
import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Verificar se o e-mail já existe na tabela usuario
export async function buscarUsuarioPorEmail(email) {
  const resultado = await pool.query(
    `SELECT id_usuario, nome, email
     FROM usuario
     WHERE LOWER(email) = LOWER($1)`,
    [email]
  );

  return resultado.rows[0];
}

// Buscar barbeiro pelo e-mail
export async function buscarBarbeiroPorEmail(email) {
  const resultado = await pool.query(
    `SELECT
       u.id_usuario,
       u.nome,
       u.email,
       u.telefone,
       u.senha,
       b.especialidade
     FROM usuario u
     INNER JOIN barbeiro b
       ON b.id_usuario = u.id_usuario
     WHERE LOWER(u.email) = LOWER($1)`,
    [email]
  );

  return resultado.rows[0];
}

// Cadastrar barbeiro
export async function criarBarbeiro(dados) {
  const { nome, email, telefone, senha, especialidade } = dados;

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const conexao = await pool.connect();

  try {
    await conexao.query("BEGIN");

    const usuario = await conexao.query(
      `INSERT INTO usuario (nome, email, telefone, senha)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nome, email, telefone`,
      [nome, email, telefone || null, senhaCriptografada]
    );

    await conexao.query(
      `INSERT INTO barbeiro (id_usuario, especialidade)
       VALUES ($1, $2)`,
      [usuario.rows[0].id_usuario, especialidade]
    );

    await conexao.query("COMMIT");

    return {
      ...usuario.rows[0],
      especialidade
    };
  } catch (erro) {
    await conexao.query("ROLLBACK");
    throw erro;
  } finally {
    conexao.release();
  }
}
