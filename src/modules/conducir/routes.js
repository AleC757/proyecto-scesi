const express = requires('express');
const routes = express.Router();
const ConducirController = require('./controller');

Router('/', ConducirController.tiempoParaConducir());
module.exports = router;