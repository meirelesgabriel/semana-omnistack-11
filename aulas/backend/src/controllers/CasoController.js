const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { titulo, descricao, valor } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection("casos").insert({
            titulo,
            descricao,
            valor,
            ong_id,
        });
        return response.json({ id });
    }
};