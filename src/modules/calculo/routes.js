const express = require('express');
const router = express.Router();
const CalculoController = require('./controller');

router.post('/calcular', CalculoController.calcular);
router.post('/tiempo-para-conducir', CalculoController.tiempoParaConducir);
module.exports(router);