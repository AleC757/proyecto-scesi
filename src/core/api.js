const express = require('express');
const router = express.Router();

router.use('/', require('../modules/calculo/routes'));
router.use('/bebidas', require('../modules/bebidas/routes'));
router.use('/historial', require('../modules/historial/routes'));

module.exports = router;
