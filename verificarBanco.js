import pool from "./src/config/db.js";

try {
  const resultado = await pool.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('usuario', 'cliente', 'barbeiro')
    ORDER BY table_name, ordinal_position;
  `);

  console.table(resultado.rows);
} catch (erro) {
  console.error("Erro ao consultar as tabelas:", erro.message);
} finally {
  await pool.end();
}
