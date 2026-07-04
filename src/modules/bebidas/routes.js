const express= require('express');
const router = express.Router();
const BebidaController = require('./controller');

router.get('/', BebidaController.getAll);
router.get('/:id', BebidaController.getById);
module.exports = router;