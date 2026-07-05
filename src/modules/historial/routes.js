const express = require('express');
const router = express.Router();
const HistorialController = require ('./controller');
router.get('/',HistorialController.getAll);
module.exports = router;