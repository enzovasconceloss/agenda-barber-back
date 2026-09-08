import pool from "../config/db.js";


// Buscar todos os clientes
const getAll = async () => {
    const query = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.telefone,
            c.data_nascimento
        FROM cliente c
        INNER JOIN usuario u
            ON c.id_usuario = u.id_usuario
        ORDER BY u.id_usuario
    `;

    const result = await pool.query(query);

    return result.rows;
};


// Buscar cliente por ID
const getById = async (id) => {
    const query = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.telefone,
            c.data_nascimento
        FROM cliente c
        INNER JOIN usuario u
            ON c.id_usuario = u.id_usuario
        WHERE u.id_usuario = $1
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};


// Criar cliente
const create = async (
    nome,
    email,
    telefone,
    senha,
    data_nascimento
) => {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Primeiro cria o usuário
        const usuarioQuery = `
            INSERT INTO usuario (
                nome,
                email,
                telefone,
                senha
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id_usuario, nome, email, telefone
        `;

        const usuarioResult = await client.query(
            usuarioQuery,
            [
                nome,
                email,
                telefone,
                senha
            ]
        );

        const usuario = usuarioResult.rows[0];


        // Depois transforma o usuário em cliente
        const clienteQuery = `
            INSERT INTO cliente (
                id_usuario,
                data_nascimento
            )
            VALUES ($1, $2)
            RETURNING id_usuario, data_nascimento
        `;

        const clienteResult = await client.query(
            clienteQuery,
            [
                usuario.id_usuario,
                data_nascimento
            ]
        );

        await client.query("COMMIT");

        return {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            data_nascimento: clienteResult.rows[0].data_nascimento
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


// Atualizar cliente
const update = async (
    id,
    nome,
    email,
    telefone,
    senha,
    data_nascimento
) => {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verificar se o cliente existe
        const verificar = await client.query(
            `
            SELECT id_usuario
            FROM cliente
            WHERE id_usuario = $1
            `,
            [id]
        );

        if (verificar.rows.length === 0) {
            await client.query("ROLLBACK");

            return null;
        }


        // Atualizar dados do usuário
        const usuarioQuery = `
            UPDATE usuario
            SET
                nome = $1,
                email = $2,
                telefone = $3,
                senha = $4
            WHERE id_usuario = $5
            RETURNING id_usuario, nome, email, telefone
        `;

        const usuarioResult = await client.query(
            usuarioQuery,
            [
                nome,
                email,
                telefone,
                senha,
                id
            ]
        );


        // Atualizar dados específicos do cliente
        const clienteQuery = `
            UPDATE cliente
            SET data_nascimento = $1
            WHERE id_usuario = $2
            RETURNING data_nascimento
        `;

        const clienteResult = await client.query(
            clienteQuery,
            [
                data_nascimento,
                id
            ]
        );

        await client.query("COMMIT");

        const usuario = usuarioResult.rows[0];
        const cliente = clienteResult.rows[0];

        return {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            data_nascimento: cliente.data_nascimento
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


// Excluir cliente
const remove = async (id) => {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");


        // Buscar cliente antes de excluir
        const clienteResult = await client.query(
            `
            SELECT
                u.id_usuario,
                u.nome,
                u.email,
                u.telefone,
                c.data_nascimento
            FROM cliente c
            INNER JOIN usuario u
                ON c.id_usuario = u.id_usuario
            WHERE u.id_usuario = $1
            `,
            [id]
        );


        if (clienteResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return null;
        }


        const cliente = clienteResult.rows[0];


        // Excluir primeiro da tabela cliente
        await client.query(
            `
            DELETE FROM cliente
            WHERE id_usuario = $1
            `,
            [id]
        );


        // Depois excluir da tabela usuario
        await client.query(
            `
            DELETE FROM usuario
            WHERE id_usuario = $1
            `,
            [id]
        );


        await client.query("COMMIT");

        return cliente;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


export default {
    getAll,
    getById,
    create,
    update,
    remove
};