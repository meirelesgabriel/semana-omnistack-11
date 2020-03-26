const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        //paginação
        const { page = 1 } = request.query;
        //contagem
        const [count] = await connection('incidents').count();
        //paginação
        const incident = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            //limita a quantidade de registros exibidos
            .limit(5)
            //configura um ponto inicial a partir da página atual. se for a primeira página, começa a partir do 0: 1,2,3,4,5.
            //se for a quarta página, começa a partir do 15: 16,17,18,19,20
            .offset((page - 1) * 5)
            //para eliminar a id da ong pra evitar a sobreposição de id's, vamos selecionar os campos que queremos:
            .select(['incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf']);
        //impressão da contagem
        response.header('X-Total-Count', count['count(*)']);    
        return response.json(incident);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;
    
        const [id] = await connection("incidents").insert({
          title,
          description,
          value,
          ong_id
        });

        return response.json({ id });
    },

    async delete(request, response) {
        //id: id que veio nos parâmetros da requisição
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id != ong_id) {
            //401: erro
            return response.status(401).json({ error: 'Operação não permitida.' });
        }
        //'id': id da tabela
        await connection('incidents')
            .where('id', id)
            .delete();
        //204: dar uma resposta pro frontend sem conteúdo
        return response.status(204).send();
    },
};