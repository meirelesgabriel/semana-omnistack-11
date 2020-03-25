connection = require('../database/connection');
//para criar podemos usar várias estratégias diferentes
//com essa não precisamos estalar nenhum novo pacote
//usamos um que já vem com o node:
const crypto = require('crypto');
module.exports = {
    async index(request, response) {
        const ongs = await connection("ongs").select("*");
        return response.json(ongs);
    },

    async create(request, response) {
        const { nome, email, whatsapp, cidade, uf } = request.body;
        //documentação do node
        const id = crypto.randomBytes(4).toString("HEX");
        //await: qnd o node chegar aqui, vai aguardar esse código finalizar para prosseguir
        await connection("ongs").insert({
            id,
            nome,
            email,
            whatsapp,
            cidade,
            uf,
        })
        return response.json({ id });
    }
};