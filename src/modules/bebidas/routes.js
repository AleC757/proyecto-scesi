const express= require('express');
const router = express.Router();
const BebidaController = require('./controller');

router.get('/', BebidaController.getAll);
router.get('/:id', BebidaController.getById);
router.post('/', BebidaController.create);
router.post('/mezcla',BebidaController.createMezcla);
router.patch('/:id', BebidaController.update);
module.exports = router;