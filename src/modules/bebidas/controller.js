const BebidaService = require('./services');
class BebidaController {
    static getAll(req,res)
    {
        res.json(BebidaService.getAll());
    }
    static getById(req,res)
    {
        const bebida = BebidaService.getById(parseInt(req.params.id));
        if(!bebida)
        {
            return res.status(404).json({
                error: 'bebida no encontrada'
            });
        }
        res.json(bebida);
    }
}
module.exports= BebidaController;