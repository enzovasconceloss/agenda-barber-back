import clienteModel from "../model/clienteModel.js";


// Buscar todos os clientes
const getAll = async (req, res) => {
    try {
        const clientes = await clienteModel.getAll();

        res.status(200).json(clientes);

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);

        res.status(500).json({
            message: "Erro ao buscar clientes."
        });
    }
};


// Buscar cliente por ID
const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await clienteModel.getById(id);

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente não encontrado."
            });
        }

        res.status(200).json(cliente);

    } catch (error) {
        console.error("Erro ao buscar cliente:", error);

        res.status(500).json({
            message: "Erro ao buscar cliente."
        });
    }
};


// Criar cliente
const create = async (req, res) => {
    try {
        const {
            nome,
            email,
            telefone,
            senha,
            data_nascimento
        } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                message: "Nome, email e senha são obrigatórios."
            });
        }

        const cliente = await clienteModel.create(
            nome,
            email,
            telefone,
            senha,
            data_nascimento
        );

        res.status(201).json({
            message: "Cliente cadastrado com sucesso!",
            cliente
        });

    } catch (error) {
        console.error("Erro ao criar cliente:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Este email já está cadastrado."
            });
        }

        res.status(500).json({
            message: "Erro ao cadastrar cliente."
        });
    }
};


// Atualizar cliente
const update = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nome,
            email,
            telefone,
            senha,
            data_nascimento
        } = req.body;

        const cliente = await clienteModel.update(
            id,
            nome,
            email,
            telefone,
            senha,
            data_nascimento
        );

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente não encontrado."
            });
        }

        res.status(200).json({
            message: "Cliente atualizado com sucesso!",
            cliente
        });

    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Este email já está cadastrado."
            });
        }

        res.status(500).json({
            message: "Erro ao atualizar cliente."
        });
    }
};


// Excluir cliente
const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await clienteModel.remove(id);

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente não encontrado."
            });
        }

        res.status(200).json({
            message: "Cliente excluído com sucesso!",
            cliente
        });

    } catch (error) {
        console.error("Erro ao excluir cliente:", error);

        if (error.code === "23503") {
            return res.status(409).json({
                message: "Não é possível excluir este cliente porque ele possui agendamentos cadastrados."
            });
        }

        res.status(500).json({
            message: "Erro ao excluir cliente."
        });
    }
};


export default {
    getAll,
    getById,
    create,
    update,
    remove
};