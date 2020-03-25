const express = require('express');

const OngController = require('./controllers/OngController');
const CasoController = require('./controllers/CasoController');

const routes = express.Router();

routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);

routes.post('/casos', CasoController.create);

module.exports = routes;
