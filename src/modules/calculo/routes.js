const express = require('express');
const router = express.Router();
const CalculoController = require('./controller');

router.post('/calcular', CalculoController.calcular);
module.exports =router;