const HistorialService = require('./services');
class HistorialController {
    static getAll(req,res)
    {
        res.json(HistorialService.getAll());
    }
}
module.exports = HistorialController;