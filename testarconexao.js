
import pool from "./src/config/db.js";

async function testarConexao() {
  try {
    const resultado = await pool.query(
      "SELECT current_database() AS banco"
    );

    console.log("CONEXÃO REALIZADA COM SUCESSO!");
    console.log("Banco:", resultado.rows[0].banco);

  } catch (erro) {
    console.error("ERRO NA CONEXÃO:", erro.message);
  } finally {
    await pool.end();
  }
}

testarConexao();
