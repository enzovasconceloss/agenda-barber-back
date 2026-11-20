
import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Buscar cliente pelo e-mail
export async function buscarClientePorEmail(email) {
  const resultado = await pool.query(
    `SELECT u.id_usuario, u.nome, u.email, u.telefone, u.senha,
            c.data_nascimento
     FROM usuario u
     INNER JOIN cliente c ON c.id_usuario = u.id_usuario
     WHERE u.email = $1`,
    [email]
  );

  return resultado.rows[0];
}

// Cadastrar cliente
export async function criarCliente(dados) {
  const { nome, email, telefone, senha, data_nascimento } = dados;

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
      `INSERT INTO cliente (id_usuario, data_nascimento)
       VALUES ($1, $2)`,
      [usuario.rows[0].id_usuario, data_nascimento || null]
    );

    await conexao.query("COMMIT");

    return usuario.rows[0];
  } catch (erro) {
    await conexao.query("ROLLBACK");
    throw erro;
  } finally {
    conexao.release();
  }
}
