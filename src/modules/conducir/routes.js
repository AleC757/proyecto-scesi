const express = require('express');
const router = express.Router();
const ConducirController = require('./controller');

router.get('/', ConducirController.tiempoParaConducir);
module.exports = router;